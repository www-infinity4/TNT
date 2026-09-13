(function (root) {
  "use strict";

  const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  // Kept for backwards compatibility with older channel code. Individual movie
  // blocks are now sized from the real movie runtime instead of being forced to 2h.
  const BLOCK_SECONDS = 7200;
  const BREAK_AFTER_CONTENT_SECONDS = [1500, 3000, 4500];
  const SPOTS_PER_BREAK = 3;
  const DEFAULT_SPOT_SECONDS = 60;

  function stationParts(date) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    }).formatToParts(date);
    return Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, Number(p.value)]));
  }

  function zonedToUtc(year, month, day, hour = 0, minute = 0, second = 0) {
    const target = Date.UTC(year, month - 1, day, hour, minute, second);
    let guess = target;
    for (let i = 0; i < 4; i++) {
      const p = stationParts(new Date(guess));
      const represented = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
      guess += target - represented;
    }
    return guess;
  }

  function dateKey(nowMs) {
    const p = stationParts(new Date(nowMs));
    return `${p.year}-${String(p.month).padStart(2,"0")}-${String(p.day).padStart(2,"0")}`;
  }

  function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 16777619);
    return value >>> 0;
  }

  function seededShuffle(items, seedText) {
    const copy = items.slice();
    let seed = hash(seedText);
    const random = () => {
      seed += 0x6D2B79F5;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function movieRuntimeSeconds(movie) {
    return Math.max(60, Math.floor(Number(movie && movie.runtimeSeconds) || 6000));
  }

  function breakDurationSeconds(commercials, breakIndex) {
    if (!Array.isArray(commercials) || !commercials.length) return SPOTS_PER_BREAK * DEFAULT_SPOT_SECONDS;
    let seconds = 0;
    for (let spot = 0; spot < SPOTS_PER_BREAK; spot++) {
      const ad = commercials[(breakIndex * SPOTS_PER_BREAK + spot) % commercials.length] || {};
      seconds += Math.max(1, Math.floor(Number(ad.durationSeconds) || DEFAULT_SPOT_SECONDS));
    }
    return seconds;
  }

  function stationDurationSeconds(movie, commercials) {
    const runtime = movieRuntimeSeconds(movie);
    const breaks = BREAK_AFTER_CONTENT_SECONDS.filter(n => n < runtime);
    return runtime + breaks.reduce((sum, _boundary, index) => sum + breakDurationSeconds(commercials, index), 0);
  }

  function nextLocalMidnight(midnightMs) {
    // 30 hours after local midnight is safely inside the following local day,
    // including 23/25-hour daylight-saving transition days.
    const p = stationParts(new Date(midnightMs + 30 * 60 * 60 * 1000));
    return zonedToUtc(p.year, p.month, p.day);
  }

  function createDaySchedule(nowMs, catalog, commercials) {
    const p = stationParts(new Date(nowMs));
    const midnightMs = zonedToUtc(p.year, p.month, p.day);
    const dayEndMs = nextLocalMidnight(midnightMs);
    const eligible = catalog.filter(movie => movie && movie.cleared && movie.videoId);
    if (!eligible.length) throw new Error("No playable movies are configured.");

    const todayKey = dateKey(nowMs);
    let shuffled = seededShuffle(eligible, todayKey);
    const previousKey = dateKey(midnightMs - 1000);
    const previous = seededShuffle(eligible, previousKey);
    if (shuffled.length > 1 && (shuffled[0] === previous[0] || shuffled.map(item => item.videoId || item.title).join("|") === previous.map(item => item.videoId || item.title).join("|"))) {
      const firstDifferent = shuffled.findIndex(item => (item.videoId || item.title) !== (previous[0].videoId || previous[0].title));
      const offset = firstDifferent > 0 ? firstDifferent : 1;
      shuffled = [...shuffled.slice(offset), ...shuffled.slice(0, offset)];
    }

    const schedule = [];
    let cursorMs = midnightMs;
    let index = 0;
    while (cursorMs < dayEndMs && index < 64) {
      const movie = shuffled[index % shuffled.length];
      const fullSeconds = stationDurationSeconds(movie, commercials);
      const remainingDaySeconds = Math.max(1, Math.floor((dayEndMs - cursorMs) / 1000));
      const blockSeconds = Math.min(fullSeconds, remainingDaySeconds);
      const endsAtMs = cursorMs + blockSeconds * 1000;
      schedule.push({
        id: `${todayKey}-${String(index).padStart(2,"0")}`,
        movie,
        startsAtMs: cursorMs,
        endsAtMs,
        blockSeconds,
        fullStationSeconds: fullSeconds
      });
      cursorMs = endsAtMs;
      index += 1;
    }
    return schedule;
  }

  function createSegments(block, commercials) {
    const runtime = movieRuntimeSeconds(block.movie);
    const boundaries = [0, ...BREAK_AFTER_CONTENT_SECONDS.filter(n => n < runtime), runtime];
    const limit = Math.max(1, Math.floor(Number(block.blockSeconds) || stationDurationSeconds(block.movie, commercials)));
    const ads = Array.isArray(commercials) ? commercials : [];
    const segments = [];
    let stationOffset = 0;
    let adIndex = 0;

    function pushSegment(segment, requestedDuration) {
      const remaining = limit - stationOffset;
      if (remaining <= 0) return false;
      const duration = Math.min(Math.max(1, Math.floor(requestedDuration)), remaining);
      segments.push({ ...segment, stationStart: stationOffset, duration });
      stationOffset += duration;
      return duration === requestedDuration;
    }

    outer:
    for (let i = 0; i < boundaries.length - 1; i++) {
      const sourceStart = boundaries[i];
      const requestedMovieDuration = boundaries[i + 1] - sourceStart;
      const completeMovieChunk = pushSegment({kind:"movie", title:block.movie.title, videoId:block.movie.videoId, cleared:block.movie.cleared, sourceStart}, requestedMovieDuration);
      if (!completeMovieChunk || stationOffset >= limit) break;

      if (i < boundaries.length - 2) {
        for (let spot = 0; spot < SPOTS_PER_BREAK; spot++) {
          const ad = ads.length ? (ads[adIndex++ % ads.length] || {}) : {title:"Station break", durationSeconds:DEFAULT_SPOT_SECONDS, videoId:"", cleared:false};
          const completeAd = pushSegment({kind:"commercial", title:ad.title || "Station break", videoId:ad.videoId || "", cleared:!!ad.cleared, sourceStart:0}, Math.max(1, Math.floor(Number(ad.durationSeconds) || DEFAULT_SPOT_SECONDS)));
          if (!completeAd || stationOffset >= limit) break outer;
        }
      }
    }

    // Never restart a finished movie merely to fill a timetable slot. If an
    // unusual ad-duration mismatch leaves a few seconds, hold a station card.
    if (stationOffset < limit) {
      pushSegment({kind:"station", title:"Next movie starts shortly", videoId:"", cleared:false, sourceStart:0}, limit - stationOffset);
    }
    return segments;
  }

  function resolve(nowMs, schedule, commercials) {
    const block = schedule.find(item => nowMs >= item.startsAtMs && nowMs < item.endsAtMs) || schedule[schedule.length - 1] || schedule[0];
    const blockElapsed = Math.max(0, Math.floor((nowMs - block.startsAtMs) / 1000));
    const segments = createSegments(block, commercials);
    const segment = segments.find(item => blockElapsed >= item.stationStart && blockElapsed < item.stationStart + item.duration) || segments[segments.length - 1];
    const segmentElapsed = Math.max(0, blockElapsed - segment.stationStart);
    const segmentIndex = segments.indexOf(segment);
    let movieReturnsIn = segment.duration - segmentElapsed;
    for (let i = segmentIndex + 1; segment.kind === "commercial" && i < segments.length && segments[i].kind === "commercial"; i++) movieReturnsIn += segments[i].duration;
    return {
      block, segment, segmentElapsed, blockElapsed,
      mediaSeconds: segment.sourceStart + segmentElapsed,
      segmentRemaining: Math.max(0, segment.duration - segmentElapsed),
      movieReturnsIn: Math.max(0, movieReturnsIn),
      blockRemaining: Math.max(0, block.blockSeconds - blockElapsed)
    };
  }

  root.HermitEngine = { TIME_ZONE, BLOCK_SECONDS, stationParts, zonedToUtc, dateKey, stationDurationSeconds, createDaySchedule, createSegments, resolve };
})(window);
