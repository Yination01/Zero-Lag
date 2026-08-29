package com.zerolag.app.ui

import android.Manifest
import android.content.Context
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.zerolag.app.boost.NetworkRefresher
import com.zerolag.app.hud.PingOverlayService
import com.zerolag.app.net.ReadinessChecker
import com.zerolag.app.net.SignalMonitor
import com.zerolag.app.ui.theme.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@Composable
fun HomeScreen() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    val signalMonitor = remember { SignalMonitor(context) }

    var signal by remember { mutableStateOf(signalMonitor.snapshot()) }
    var testing by remember { mutableStateOf(false) }
    var result by remember { mutableStateOf<ReadinessChecker.Result?>(null) }
    var hudOn by remember { mutableStateOf(false) }
    var showRefreshHelp by remember { mutableStateOf(false) }

    val locationPermission = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) {
        signal = signalMonitor.snapshot()
    }

    val overlaySettings = rememberLauncherForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { /* re-check on resume */ }

    LaunchedEffect(Unit) {
        // Ask for notification permission (Android 13+) for the HUD service.
        val perms = buildList {
            add(Manifest.permission.ACCESS_FINE_LOCATION)
            add(Manifest.permission.READ_PHONE_STATE)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                add(Manifest.permission.POST_NOTIFICATIONS)
            }
        }.toTypedArray()
        locationPermission.launch(perms)
    }

    Column(
        Modifier
            .fillMaxSize()
            .background(Background)
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Spacer(Modifier.height(24.dp))

        // Header
        Text("ZeroLag", style = ZeroLagTypography.headlineLarge)
        Text(
            "Network optimizer for mobile gamers",
            style = ZeroLagTypography.bodyMedium
        )

        Spacer(Modifier.height(4.dp))

        // Signal card
        Card(
            colors = CardDefaults.cardColors(containerColor = Surface),
            shape = RoundedCornerShape(18.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("CURRENT CONNECTION", style = ZeroLagTypography.labelLarge,
                    color = OnSurfaceMuted)
                Spacer(Modifier.height(2.dp))
                Row(
                    Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(signal.carrier, style = ZeroLagTypography.titleLarge)
                        Text(signal.networkType, style = ZeroLagTypography.bodyMedium)
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        signal.dbm?.let {
                            Text("$it dBm", fontSize = 24.sp, fontWeight = FontWeight.Bold,
                                color = signalColor(it))
                        }
                        Text(signal.quality, style = ZeroLagTypography.bodyMedium)
                    }
                }
            }
        }

        // Readiness card
        Card(
            colors = CardDefaults.cardColors(containerColor = Surface),
            shape = RoundedCornerShape(18.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                Modifier.padding(18.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text("PRE-MATCH READINESS", style = ZeroLagTypography.labelLarge,
                    color = OnSurfaceMuted)

                val r = result
                if (r == null) {
                    Text(
                        if (testing) "Testing your connection…"
                        else "Run a quick test before you queue for a match.",
                        style = ZeroLagTypography.bodyLarge,
                        textAlign = TextAlign.Center
                    )
                } else {
                    VerdictBadge(r)
                    Row(
                        Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        Stat("Ping", "${r.avgPingMs} ms")
                        Stat("Jitter", "${r.jitterMs} ms")
                        Stat("Loss", "${r.lossPercent}%")
                    }
                }

                Button(
                    onClick = {
                        testing = true
                        result = null
                        scope.launch {
                            val res = withContext(Dispatchers.IO) {
                                ReadinessChecker().run()
                            }
                            result = res
                            testing = false
                            signal = signalMonitor.snapshot()
                        }
                    },
                    enabled = !testing,
                    modifier = Modifier.fillMaxWidth().height(54.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = NeonGreen, contentColor = Background
                    )
                ) {
                    Text(
                        if (testing) "TESTING…" else "RUN MATCH-READINESS TEST",
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // HUD toggle
        Card(
            colors = CardDefaults.cardColors(containerColor = Surface),
            shape = RoundedCornerShape(18.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                Modifier.padding(18.dp).fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(Modifier.weight(1f)) {
                    Text("Floating ping HUD", style = ZeroLagTypography.titleLarge)
                    Text(
                        "Live ping meter over your game. Passive — never " +
                            "interrupts a match.",
                        style = ZeroLagTypography.bodyMedium
                    )
                }
                Switch(
                    checked = hudOn,
                    onCheckedChange = { wantOn ->
                        if (wantOn) {
                            if (canDrawOverlays(context)) {
                                PingOverlayService.start(context)
                                hudOn = true
                            } else {
                                // Send user to the "display over other apps" screen.
                                val intent = android.content.Intent(
                                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                    Uri.parse("package:${context.packageName}")
                                )
                                overlaySettings.launch(intent)
                            }
                        } else {
                            PingOverlayService.stop(context)
                            hudOn = false
                        }
                    }
                )
            }
        }

        // One-tap refresh (pre-match only)
        OutlinedButton(
            onClick = { showRefreshHelp = true },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text("ONE-TAP NETWORK REFRESH  (pre-match)",
                color = NeonGreen, fontWeight = FontWeight.SemiBold)
        }

        Text(
            "⚠ Use refresh BEFORE matchmaking — never during a live match.",
            style = ZeroLagTypography.bodyMedium,
            color = Amber
        )

        Spacer(Modifier.height(24.dp))
    }

    if (showRefreshHelp) {
        AlertDialog(
            onDismissRequest = { showRefreshHelp = false },
            containerColor = SurfaceVariant,
            title = { Text("Network refresh") },
            text = { Text(NetworkRefresher.INSTRUCTIONS) },
            confirmButton = {
                TextButton(onClick = {
                    showRefreshHelp = false
                    NetworkRefresher.openAirplaneModeSettings(context)
                }) { Text("OPEN SETTINGS", color = NeonGreen) }
            },
            dismissButton = {
                TextButton(onClick = { showRefreshHelp = false }) {
                    Text("CANCEL", color = OnSurfaceMuted)
                }
            }
        )
    }
}

@Composable
private fun Stat(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = OnSurface)
        Text(label, style = ZeroLagTypography.bodyMedium)
    }
}

@Composable
private fun VerdictBadge(r: ReadinessChecker.Result) {
    val (text, color) = when (r.verdict) {
        ReadinessChecker.Verdict.MATCH_READY -> "MATCH READY — safe to queue" to NeonGreen
        ReadinessChecker.Verdict.PLAYABLE -> "PLAYABLE — some lag risk" to Amber
        ReadinessChecker.Verdict.RISKY -> "RISKY — high lag expected" to Red
        ReadinessChecker.Verdict.NO_CONNECTION -> "NO CONNECTION" to Red
    }
    Surface(
        color = color.copy(alpha = 0.15f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text,
            color = color,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(vertical = 12.dp)
        )
    }
}

private fun signalColor(dbm: Int): Color = when {
    dbm >= -95 -> NeonGreen
    dbm >= -110 -> Amber
    else -> Red
}

private fun canDrawOverlays(context: Context): Boolean =
    Settings.canDrawOverlays(context)
