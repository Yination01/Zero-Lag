package com.zerolag.app.net

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.telephony.CellInfo
import android.telephony.CellInfoCdma
import android.telephony.CellInfoGsm
import android.telephony.CellInfoLte
import android.telephony.CellInfoNr
import android.telephony.CellInfoWcdma
import android.telephony.TelephonyManager
import androidx.core.content.ContextCompat

/**
 * Reads honest cellular signal metrics from TelephonyManager.
 *
 * NOTE: [allCellInfo] only returns data when the app holds
 * ACCESS_FINE_LOCATION (Android requirement) and location services are on.
 * Call [hasPermission] first and degrade gracefully in the UI when denied.
 */
class SignalMonitor(private val context: Context) {

    data class Snapshot(
        val carrier: String,
        val networkType: String,     // "5G", "4G LTE", "3G", "Wi-Fi", "—"
        val dbm: Int?,              // signal strength; null if unavailable
        val quality: String,        // human label
    )

    private val telephony =
        context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
    private val connectivity =
        context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    fun hasPermission(): Boolean =
        ContextCompat.checkSelfPermission(
            context, Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

    @Suppress("MissingPermission")
    fun snapshot(): Snapshot {
        val activeNetwork = connectivity.activeNetwork
        val caps = activeNetwork?.let { connectivity.getNetworkCapabilities(it) }

        val onWifi = caps?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true

        val carrier = if (hasPermission()) {
            telephony.networkOperatorName?.takeIf { it.isNotBlank() }
        } else null

        if (onWifi) {
            return Snapshot(
                carrier = carrier ?: "Wi-Fi",
                networkType = "Wi-Fi",
                dbm = null,
                quality = "Wi-Fi connection",
            )
        }

        if (!hasPermission()) {
            return Snapshot(carrier ?: "Unknown", "—", null, "Grant location permission")
        }

        val networkType = runCatching { networkTypeLabel(caps) }
            .getOrDefault("Cellular")
        val dbm = readRegisteredDbm()
        return Snapshot(
            carrier = carrier ?: "Unknown",
            networkType = networkType,
            dbm = dbm,
            quality = dbm?.let { qualityLabel(it) } ?: "Signal unavailable",
        )
    }

    private fun networkTypeLabel(caps: NetworkCapabilities?): String = when {
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
            caps?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true -> {
            when (telephony.dataNetworkType) {
                TelephonyManager.NETWORK_TYPE_NR -> "5G"
                TelephonyManager.NETWORK_TYPE_LTE -> "4G LTE"
                TelephonyManager.NETWORK_TYPE_HSPAP,
                TelephonyManager.NETWORK_TYPE_HSPA,
                TelephonyManager.NETWORK_TYPE_UMTS -> "3G"
                TelephonyManager.NETWORK_TYPE_EDGE,
                TelephonyManager.NETWORK_TYPE_GPRS -> "2G"
                else -> "Cellular"
            }
        }
        else -> "Cellular"
    }

    @Suppress("MissingPermission")
    private fun readRegisteredDbm(): Int? {
        val cells: List<CellInfo> = telephony.allCellInfo ?: return null
        val registered = cells.firstOrNull { it.isRegistered } ?: return null

        // CellInfoNr (5G) only exists on Android Q+; guard the class access so
        // older devices never try to load it.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
            registered is CellInfoNr
        ) {
            return registered.cellSignalStrength.dbm.takeIf { it > -200 }
        }
        return when (registered) {
            is CellInfoLte -> registered.cellSignalStrength.rsrp.takeIf { it > -200 }
            is CellInfoWcdma -> registered.cellSignalStrength.dbm.takeIf { it > -200 }
            is CellInfoGsm -> registered.cellSignalStrength.dbm.takeIf { it > -200 }
            is CellInfoCdma -> registered.cellSignalStrength.dbm.takeIf { it > -200 }
            else -> null
        }
    }

    /** Rough RSRP/RSSI quality buckets (dBm; closer to 0 = stronger). */
    private fun qualityLabel(dbm: Int): String = when {
        dbm >= -80 -> "Excellent"
        dbm >= -95 -> "Good"
        dbm >= -110 -> "Fair"
        dbm >= -120 -> "Weak"
        else -> "Very weak"
    }
}
