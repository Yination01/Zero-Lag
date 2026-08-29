package com.zerolag.app.net

import kotlin.math.abs

/**
 * Pre-match readiness test.
 *
 * Runs a burst of lightweight RTT probes and grades the connection the way
 * a competitive gamer needs: average ping, jitter (variation between
 * consecutive samples) and packet loss.
 *
 * Thresholds (tuned for eFootball / competitive mobile play):
 *   MATCH READY  -> avg ping < 80 ms AND jitter < 15 ms AND 0% loss
 *   PLAYABLE     -> avg ping < 130 ms AND jitter < 35 ms AND loss <= 10%
 *   RISKY        -> anything worse
 */
class ReadinessChecker {

    enum class Verdict { MATCH_READY, PLAYABLE, RISKY, NO_CONNECTION }

    data class Result(
        val avgPingMs: Int,
        jitterMs: Int,
        lossPercent: Int,
        val samples: Int,
        val verdict: Verdict,
    ) {
        val isSafeToPlay: Boolean get() = verdict == Verdict.MATCH_READY
    }

    suspend fun run(sampleCount: Int = 8): Result {
        val probes = PingProbe.probeSeries(count = sampleCount)
        val rtts = probes.mapNotNull { it.rttMs }

        if (rtts.isEmpty()) {
            return Result(0, 0, 100, probes.size, Verdict.NO_CONNECTION)
        }

        val avg = rtts.average().toInt()

        val jitter = if (rtts.size > 1) {
            var total = 0L
            for (i in 1 until rtts.size) total += abs(rtts[i] - rtts[i - 1])
            (total / (rtts.size - 1)).toInt()
        } else 0

        val loss = ((probes.size - rtts.size) * 100) / probes.size

        val verdict = when {
            avg < 80 && jitter < 15 && loss == 0 -> Verdict.MATCH_READY
            avg < 130 && jitter < 35 && loss <= 10 -> Verdict.PLAYABLE
            else -> Verdict.RISKY
        }
        return Result(avg, jitter, loss, probes.size, verdict)
    }
}
