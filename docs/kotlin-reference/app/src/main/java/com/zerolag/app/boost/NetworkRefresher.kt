package com.zerolag.app.boost

import android.content.Context
import android.content.Intent
import android.provider.Settings

/**
 * "One-tap network refresh" — done honestly.
 *
 * Android does NOT allow ordinary apps to toggle airplane mode or reset the
 * radio (only system apps can). The old trick `Runtime.exec("ip neighbor
 * flush")` needs root and silently fails on normal phones.
 *
 * What genuinely works: opening the airplane-mode quick setting so the user
 * flips it ON, waits ~5 seconds, and flips it OFF. That forces the modem to
 * drop its stale tower lock and re-register on the strongest nearby cell —
 * a real, measurable improvement on congested cells.
 */
object NetworkRefresher {

    /**
     * Opens the system settings screen where airplane mode can be toggled.
     * Prefers the dedicated airplane-mode settings, falls back to the main
     * wireless settings.
     */
    fun openAirplaneModeSettings(context: Context) {
        val intents = listOf(
            Intent(Settings.ACTION_AIRPLANE_MODE_SETTINGS),
            Intent(Settings.ACTION_WIRELESS_SETTINGS),
            Intent(Settings.ACTION_SETTINGS),
        )
        val intent = intents.firstOrNull { it.resolveActivity(context.packageManager) != null }
            ?: Intent(Settings.ACTION_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    }

    /** Short instruction shown to the user when the settings screen opens. */
    val INSTRUCTIONS: String =
        "1. Turn Airplane mode ON\n" +
        "2. Wait 5 seconds\n" +
        "3. Turn it back OFF\n\n" +
        "Your phone will reconnect to the strongest nearby tower."
}
