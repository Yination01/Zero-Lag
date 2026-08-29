package com.zerolag.app.net

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.InetSocketAddress
import java.net.Socket

/**
 * Measures round-trip time without root and without relying on the `ping`
 * shell binary (which is blocked or missing on many OEM Android builds).
 *
 * We open a TCP connection to a well-known anycast endpoint on port 443 and
 * time how long the connect() takes. This is a real, deterministic RTT
 * sample to the nearest edge of Cloudflare/Google.
 */
object PingProbe {

    /** A single probe attempt. [rttMs] is null when the probe failed (loss). */
    data class Sample(val rttMs: Long?, val host: String)

    // Anycast endpoints — traffic lands on the nearest regional edge.
    private val TARGETS = listOf(
        "1.1.1.1" to 443,   // Cloudflare
        "8.8.8.8" to 443,   // Google
    )

    suspend fun probeOnce(timeoutMs: Int = 2000): Sample = withContext(Dispatchers.IO) {
        val (host, port) = TARGETS.random()
        var socket: Socket? = null
        try {
            socket = Socket()
            val start = System.nanoTime()
            socket.connect(InetSocketAddress(host, port), timeoutMs)
            val rtt = (System.nanoTime() - start) / 1_000_000
            Sample(rtt, host)
        } catch (e: Exception) {
            Sample(null, host) // timed out / unreachable => packet loss
        } finally {
            runCatching { socket?.close() }
        }
    }

    /** Run [count] probes sequentially with a short gap. */
    suspend fun probeSeries(count: Int = 8, gapMs: Long = 250): List<Sample> {
        val out = ArrayList<Sample>(count)
        repeat(count) {
            out += probeOnce()
            kotlinx.coroutines.delay(gapMs)
        }
        return out
    }
}
