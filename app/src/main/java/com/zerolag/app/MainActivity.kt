package com.zerolag.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.zerolag.app.ui.HomeScreen
import com.zerolag.app.ui.theme.ZeroLagTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ZeroLagTheme {
                HomeScreen()
            }
        }
    }
}
