export interface KotlinFile {
  path: string;
  filename: string;
  language: string;
  category: 'compose_ui' | 'repository' | 'model' | 'theme';
  description: string;
  code: string;
}

export const KOTLIN_CODEBASE: KotlinFile[] = [
  {
    path: 'app/src/main/java/com/chubbychat/ui/membership/MembershipPlanScreen.kt',
    filename: 'MembershipPlanScreen.kt',
    language: 'kotlin',
    category: 'compose_ui',
    description: 'Jetpack Compose VIP Membership Plans Screen (₹49-₹249 with Coin packs and instant VIP badge).',
    code: `package com.chubbychat.ui.membership

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.chubbychat.model.MembershipPlan
import com.chubbychat.model.UserWallet

// Deep Violet Theme Colors
val DeepVioletBackground = Color(0xFF0E0720)
val DeepVioletSurface = Color(0xFF170D38)
val AccentPurple = Color(0xFF6C3BFF)
val AccentPink = Color(0xFFFF3B80)
val AccentGold = Color(0xFFFFD700)
val AccentCyan = Color(0xFF00D1FF)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MembershipPlanScreen(
    wallet: UserWallet,
    onBack: () -> Unit,
    onPurchasePlan: (MembershipPlan) -> Unit
) {
    val plans = remember {
        listOf(
            MembershipPlan("plan_49", "Starter Pass", 49, 200, "Best for casual gifters"),
            MembershipPlan("plan_89", "Popular Pass", 89, 250, "Most picked by members", isPopular = true),
            MembershipPlan("plan_149", "Silver Pass", 149, 350, "Extra coin bonus"),
            MembershipPlan("plan_199", "Gold Pass", 199, 500, "High value package"),
            MembershipPlan("plan_249", "Royal VIP", 249, 1000, "Maximum coin reward", isBestValue = true)
        )
    }
    var selectedPlan by remember { mutableStateOf(plans[1]) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "VIP Membership & Coins",
                        color = Color.White,
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DeepVioletSurface)
            )
        },
        containerColor = DeepVioletBackground
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(8.dp))
                // VIP Hero Status Card
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(24.dp))
                        .background(
                            Brush.linearGradient(
                                listOf(Color(0xFF230D57), Color(0xFF170D38), Color(0xFF110729))
                            )
                        )
                        .border(1.dp, AccentPurple.copy(alpha = 0.5f), RoundedCornerShape(24.dp))
                        .padding(20.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = if (wallet.isMember) "👑 VIP MEMBER ACTIVE" else "⭐ VIP MEMBERSHIP",
                                color = AccentGold,
                                fontWeight = FontWeight.Black,
                                fontSize = 12.sp,
                                letterSpacing = 1.sp
                            )
                            Surface(
                                color = AccentPurple.copy(alpha = 0.3f),
                                shape = RoundedCornerShape(12.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, AccentPurple)
                            ) {
                                Text(
                                    text = "🪙 \${wallet.coinBalance} Coins",
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                )
                            }
                        }
                        Text(
                            text = "Send Virtual Gifts & Climb the Leaderboard",
                            color = Color.White,
                            fontWeight = FontWeight.Black,
                            fontSize = 20.sp
                        )
                        Text(
                            text = "Rule: Only members can buy coins. Unlock Rose, Heart, Crown and Diamond gifts instantly.",
                            color = Color.White.copy(alpha = 0.7f),
                            fontSize = 12.sp
                        )
                    }
                }
            }

            item {
                Text(
                    text = "SELECT YOUR MEMBERSHIP PLAN",
                    color = Color.White.copy(alpha = 0.6f),
                    fontWeight = FontWeight.Black,
                    fontSize = 11.sp,
                    letterSpacing = 1.sp
                )
            }

            items(plans) { plan ->
                val isSelected = plan.id == selectedPlan.id
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(
                            if (isSelected) DeepVioletSurface else Color.White.copy(alpha = 0.05f)
                        )
                        .border(
                            width = if (isSelected) 2.dp else 1.dp,
                            color = if (isSelected) AccentPurple else Color.White.copy(alpha = 0.1f),
                            shape = RoundedCornerShape(20.dp)
                        )
                        .clickable { selectedPlan = plan }
                        .padding(16.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text(
                                    text = plan.name,
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp
                                )
                                if (plan.isPopular) {
                                    Surface(
                                        color = AccentPink,
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Text(
                                            "POPULAR",
                                            color = Color.White,
                                            fontWeight = FontWeight.Black,
                                            fontSize = 9.sp,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }
                                if (plan.isBestValue) {
                                    Surface(
                                        color = AccentGold,
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Text(
                                            "BEST VALUE",
                                            color = Color.Black,
                                            fontWeight = FontWeight.Black,
                                            fontSize = 9.sp,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }
                            }
                            Text(
                                text = "🪙 \${plan.coins} Coins Included",
                                color = AccentGold,
                                fontWeight = FontWeight.Black,
                                fontSize = 14.sp
                            )
                            Text(
                                text = plan.tagline,
                                color = Color.White.copy(alpha = 0.6f),
                                fontSize = 11.sp
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "₹\${plan.priceInr}",
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 20.sp
                            )
                            RadioButton(
                                selected = isSelected,
                                onClick = { selectedPlan = plan },
                                colors = RadioButtonDefaults.colors(
                                    selectedColor = AccentPurple,
                                    unselectedColor = Color.White.copy(alpha = 0.4f)
                                )
                            )
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(10.dp))
                Button(
                    onClick = { onPurchasePlan(selectedPlan) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .shadow(16.dp, RoundedCornerShape(18.dp), spotColor = AccentPurple),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AccentPurple)
                ) {
                    Text(
                        text = "BUY NOW • ₹\${selectedPlan.priceInr} (\${selectedPlan.coins} COINS)",
                        fontWeight = FontWeight.Black,
                        fontSize = 13.sp,
                        letterSpacing = 1.sp
                    )
                }
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/chubbychat/ui/chat/GiftBottomSheet.kt',
    filename: 'GiftBottomSheet.kt',
    language: 'kotlin',
    category: 'compose_ui',
    description: 'Jetpack Compose Gift Bottom Sheet for sending Rose(7), Heart(15), Coffee(25), Cake(50), Teddy(100), Crown(150), Diamond(250).',
    code: `package com.chubbychat.ui.chat

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.chubbychat.model.VirtualGiftItem
import com.chubbychat.model.UserWallet

val DeepVioletSurface = Color(0xFF170D38)
val AccentPurple = Color(0xFF6C3BFF)
val AccentGold = Color(0xFFFFD700)
val AccentPink = Color(0xFFFF3B80)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GiftBottomSheet(
    receiverName: String,
    wallet: UserWallet,
    onDismiss: () -> Unit,
    onSendGift: (gift: VirtualGiftItem, count: Int) -> Unit,
    onOpenMembership: () -> Unit
) {
    val giftList = remember {
        listOf(
            VirtualGiftItem("gift_rose", "Rose", "🌹", 7, "A sweet gentle gesture"),
            VirtualGiftItem("gift_heart", "Heart", "💖", 15, "Show your deep appreciation"),
            VirtualGiftItem("gift_coffee", "Coffee", "☕", 25, "Warm friendly coffee"),
            VirtualGiftItem("gift_cake", "Cake", "🎂", 50, "Celebration sweet treat"),
            VirtualGiftItem("gift_teddy", "Teddy", "🧸", 100, "Cuddly companion"),
            VirtualGiftItem("gift_crown", "Crown", "👑", 150, "Royal VIP badge status"),
            VirtualGiftItem("gift_diamond", "Diamond", "💎", 250, "Ultimate prestige luxury")
        )
    }

    var selectedGift by remember { mutableStateOf(giftList[0]) }
    var selectedCount by remember { mutableStateOf(1) }
    val totalCost = selectedGift.coinValue * selectedCount
    val canAfford = wallet.coinBalance >= totalCost

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = DeepVioletSurface,
        shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "🎁 SEND VIRTUAL GIFT",
                        color = AccentGold,
                        fontWeight = FontWeight.Black,
                        fontSize = 11.sp,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "To $receiverName",
                        color = Color.White,
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp
                    )
                }

                Surface(
                    color = Color.White.copy(alpha = 0.08f),
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.15f)),
                    modifier = Modifier.clickable { onOpenMembership() }
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text("🪙", fontSize = 14.sp)
                        Text(
                            "\${wallet.coinBalance}",
                            color = AccentGold,
                            fontWeight = FontWeight.Black,
                            fontSize = 13.sp
                        )
                        Text("+", color = AccentPurple, fontWeight = FontWeight.Black)
                    }
                }
            }

            // Gifts Grid
            LazyVerticalGrid(
                columns = GridCells.Fixed(4),
                modifier = Modifier.fillMaxWidth().height(210.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(giftList) { gift ->
                    val isSelected = gift.id == selectedGift.id
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(
                                if (isSelected) AccentPurple.copy(alpha = 0.25f) else Color.White.copy(alpha = 0.05f)
                            )
                            .border(
                                width = if (isSelected) 2.dp else 1.dp,
                                color = if (isSelected) AccentPurple else Color.White.copy(alpha = 0.1f),
                                shape = RoundedCornerShape(16.dp)
                            )
                            .clickable { selectedGift = gift }
                            .padding(8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(2.dp)
                        ) {
                            Text(gift.icon, fontSize = 28.sp)
                            Text(
                                gift.name,
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp
                            )
                            Text(
                                "🪙 \${gift.coinValue}",
                                color = AccentGold,
                                fontWeight = FontWeight.Black,
                                fontSize = 10.sp
                            )
                        }
                    }
                }
            }

            // Multiplier Counts
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(1, 5, 10, 50).forEach { multiplier ->
                    val isSelected = selectedCount == multiplier
                    Surface(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .clickable { selectedCount = multiplier },
                        color = if (isSelected) AccentPurple else Color.White.copy(alpha = 0.08f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            "\${multiplier}x",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(vertical = 8.dp)
                        )
                    }
                }
            }

            // Action Button
            if (canAfford) {
                Button(
                    onClick = {
                        onSendGift(selectedGift, selectedCount)
                        onDismiss()
                    },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AccentPurple)
                ) {
                    Text(
                        "SEND \${selectedGift.name.uppercase()} • 🪙 $totalCost COINS",
                        fontWeight = FontWeight.Black,
                        fontSize = 13.sp,
                        letterSpacing = 1.sp
                    )
                }
            } else {
                Button(
                    onClick = {
                        onDismiss()
                        onOpenMembership()
                    },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AccentPink)
                ) {
                    Text(
                        "INSUFFICIENT COINS • GET VIP MEMBERSHIP",
                        fontWeight = FontWeight.Black,
                        fontSize = 12.sp,
                        letterSpacing = 1.sp
                    )
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/chubbychat/ui/leaderboard/LeaderboardScreen.kt',
    filename: 'LeaderboardScreen.kt',
    language: 'kotlin',
    category: 'compose_ui',
    description: 'Jetpack Compose Hall of Fame Leaderboard Screen with 6 Ranking Tiers (Non, Bronze, Silver, Diamond, Platinum, Super Platinum).',
    code: `package com.chubbychat.ui.leaderboard

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.chubbychat.model.LeaderboardUser
import com.chubbychat.model.RankTier

val DeepVioletBackground = Color(0xFF0E0720)
val DeepVioletSurface = Color(0xFF170D38)
val AccentPurple = Color(0xFF6C3BFF)
val AccentGold = Color(0xFFFFD700)
val AccentSilver = Color(0xFFC0C0C0)
val AccentBronze = Color(0xFFCD7F32)
val AccentDiamond = Color(0xFF00D1FF)
val AccentPlatinum = Color(0xFFA855F7)
val AccentSuperPlatinum = Color(0xFFFF1493)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LeaderboardScreen(
    leaderboardUsers: List<LeaderboardUser>,
    onSelectUser: (LeaderboardUser) -> Unit
) {
    var selectedFilter by remember { mutableStateOf("all_time") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepVioletBackground)
    ) {
        // Top Header
        Surface(
            color = DeepVioletSurface,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    "🏆 HALL OF FAME",
                    color = AccentGold,
                    fontWeight = FontWeight.Black,
                    fontSize = 11.sp,
                    letterSpacing = 1.sp
                )
                Text(
                    "Top Gifters & Champions",
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 22.sp
                )
                Text(
                    "Rankings updated automatically from lifetime coins sent & received.",
                    color = Color.White.copy(alpha = 0.6f),
                    fontSize = 12.sp
                )
            }
        }

        // Podium for Top 3
        if (leaderboardUsers.size >= 3) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.Bottom
            ) {
                PodiumItem(user = leaderboardUsers[1], rank = 2, height = 110.dp, color = AccentSilver)
                PodiumItem(user = leaderboardUsers[0], rank = 1, height = 140.dp, color = AccentGold)
                PodiumItem(user = leaderboardUsers[2], rank = 3, height = 90.dp, color = AccentBronze)
            }
        }

        // Full List
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            itemsIndexed(leaderboardUsers) { index, user ->
                LeaderboardRow(rank = index + 1, user = user)
            }
        }
    }
}

@Composable
fun PodiumItem(user: LeaderboardUser, rank: Int, height: androidx.compose.ui.unit.Dp, color: Color) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        AsyncImage(
            model = user.avatarUrl,
            contentDescription = user.name,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .size(if (rank == 1) 56.dp else 46.dp)
                .clip(CircleShape)
                .border(2.dp, color, CircleShape)
        )
        Text(user.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
        Text("🪙 \${user.totalLifetimeCoins}", color = AccentGold, fontWeight = FontWeight.Black, fontSize = 10.sp)

        Box(
            modifier = Modifier
                .width(80.dp)
                .height(height)
                .clip(RoundedCornerShape(topStart = 14.dp, topEnd = 14.dp))
                .background(
                    Brush.verticalGradient(listOf(color.copy(alpha = 0.4f), DeepVioletSurface))
                )
                .border(1.dp, color.copy(alpha = 0.6f), RoundedCornerShape(topStart = 14.dp, topEnd = 14.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text("#$rank", color = Color.White, fontWeight = FontWeight.Black, fontSize = 20.sp)
        }
    }
}

@Composable
fun LeaderboardRow(rank: Int, user: LeaderboardUser) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(DeepVioletSurface)
            .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(16.dp))
            .padding(12.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    "#$rank",
                    color = if (rank <= 3) AccentGold else Color.White.copy(alpha = 0.5f),
                    fontWeight = FontWeight.Black,
                    fontSize = 14.sp,
                    modifier = Modifier.width(28.dp)
                )
                AsyncImage(
                    model = user.avatarUrl,
                    contentDescription = user.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.size(40.dp).clip(CircleShape)
                )
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(user.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Surface(
                            color = getRankTierColor(user.rankTier).copy(alpha = 0.2f),
                            shape = RoundedCornerShape(6.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, getRankTierColor(user.rankTier).copy(alpha = 0.5f))
                        ) {
                            Text(
                                user.rankTier.displayName,
                                color = getRankTierColor(user.rankTier),
                                fontWeight = FontWeight.Black,
                                fontSize = 9.sp,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                    Text(
                        "\${user.giftsSentCount} Gifts Sent • \${user.giftsReceivedCount} Received",
                        color = Color.White.copy(alpha = 0.6f),
                        fontSize = 10.sp
                    )
                }
            }

            Text(
                "🪙 \${user.totalLifetimeCoins}",
                color = AccentGold,
                fontWeight = FontWeight.Black,
                fontSize = 13.sp
            )
        }
    }
}

fun getRankTierColor(tier: RankTier): Color = when (tier) {
    RankTier.NON -> Color.Gray
    RankTier.BRONZE -> AccentBronze
    RankTier.SILVER -> AccentSilver
    RankTier.DIAMOND -> AccentDiamond
    RankTier.PLATINUM -> AccentPlatinum
    RankTier.SUPER_PLATINUM -> AccentSuperPlatinum
}
`
  },
  {
    path: 'app/src/main/java/com/chubbychat/data/repository/FirestoreGiftRepository.kt',
    filename: 'FirestoreGiftRepository.kt',
    language: 'kotlin',
    category: 'repository',
    description: 'Kotlin Coroutines / Flow Repository executing atomic Firestore batch operations for Coins, Gifts, Lifetime totals & Leaderboard.',
    code: `package com.chubbychat.data.repository

import com.chubbychat.model.*
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FirestoreGiftRepository @Inject constructor(
    private val firestore: FirebaseFirestore
) {
    /**
     * Executes atomic Firestore transaction to:
     * 1. Verify sender has VIP membership and sufficient coin balance.
     * 2. Deduct sender coins instantly.
     * 3. Add coins and virtual gift message to receiver in chat.
     * 4. Save total lifetime coins for both sender & receiver.
     * 5. Update global leaderboard rankings.
     */
    suspend fun sendGiftTransaction(
        chatId: String,
        senderId: String,
        receiverId: String,
        gift: VirtualGiftItem,
        count: Int
    ): Result<Unit> = runCatching {
        val totalCoins = gift.coinValue * count
        val senderWalletRef = firestore.collection("wallets").document(senderId)
        val receiverWalletRef = firestore.collection("wallets").document(receiverId)
        val chatMessagesRef = firestore.collection("chats").document(chatId).collection("messages").document()
        val senderTransactionsRef = senderWalletRef.collection("transactions").document()
        val receiverTransactionsRef = receiverWalletRef.collection("transactions").document()

        firestore.runTransaction { transaction ->
            val senderSnapshot = transaction.get(senderWalletRef)
            val currentBalance = senderSnapshot.getLong("coinBalance") ?: 0
            val isMember = senderSnapshot.getBoolean("isMember") ?: false

            if (!isMember) {
                throw IllegalStateException("Only VIP members can send gifts and buy coins.")
            }
            if (currentBalance < totalCoins) {
                throw IllegalStateException("Insufficient coin balance. Current: $currentBalance, Required: $totalCoins")
            }

            // 1. Deduct sender coins & increment lifetime sent
            transaction.update(senderWalletRef, mapOf(
                "coinBalance" to FieldValue.increment(-totalCoins.toLong()),
                "lifetimeCoinsSent" to FieldValue.increment(totalCoins.toLong()),
                "totalGiftsSent" to FieldValue.increment(count.toLong()),
                "updatedAt" to FieldValue.serverTimestamp()
            ))

            // 2. Increment receiver lifetime received
            transaction.update(receiverWalletRef, mapOf(
                "lifetimeCoinsReceived" to FieldValue.increment(totalCoins.toLong()),
                "totalGiftsReceived" to FieldValue.increment(count.toLong()),
                "updatedAt" to FieldValue.serverTimestamp()
            ))

            // 3. Post gift message to chat thread
            val giftMessage = mapOf(
                "id" to chatMessagesRef.id,
                "senderId" to senderId,
                "receiverId" to receiverId,
                "type" to "gift",
                "content" to "Sent $count \${gift.name} \${gift.icon}",
                "giftData" to mapOf(
                    "giftId" to gift.id,
                    "giftName" to gift.name,
                    "icon" to gift.icon,
                    "count" to count,
                    "coinValue" to gift.coinValue,
                    "totalCoins" to totalCoins
                ),
                "timestamp" to FieldValue.serverTimestamp(),
                "isRead" to false
            )
            transaction.set(chatMessagesRef, giftMessage)

            // 4. Record passbook transactions
            transaction.set(senderTransactionsRef, mapOf(
                "type" to "gift_sent",
                "amount" to -totalCoins,
                "giftName" to gift.name,
                "counterpartId" to receiverId,
                "timestamp" to FieldValue.serverTimestamp()
            ))

            transaction.set(receiverTransactionsRef, mapOf(
                "type" to "gift_received",
                "amount" to totalCoins,
                "giftName" to gift.name,
                "counterpartId" to senderId,
                "timestamp" to FieldValue.serverTimestamp()
            ))
        }.await()
    }

    /**
     * Real-time Leaderboard query listening to top users ordered by lifetime coins.
     */
    fun getLeaderboardFlow(): Flow<List<LeaderboardUser>> = callbackFlow {
        val listener = firestore.collection("wallets")
            .orderBy("lifetimeCoinsSent", Query.Direction.DESCENDING)
            .limit(50)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val users = snapshot?.documents?.mapNotNull { doc ->
                    val sent = doc.getLong("lifetimeCoinsSent") ?: 0
                    val received = doc.getLong("lifetimeCoinsReceived") ?: 0
                    val total = sent + received
                    val rankTier = calculateRankTier(total)

                    LeaderboardUser(
                        userId = doc.id,
                        name = doc.getString("userName") ?: "Chubby User",
                        avatarUrl = doc.getString("userAvatar") ?: "",
                        totalLifetimeCoins = total,
                        giftsSentCount = (doc.getLong("totalGiftsSent") ?: 0).toInt(),
                        giftsReceivedCount = (doc.getLong("totalGiftsReceived") ?: 0).toInt(),
                        rankTier = rankTier
                    )
                } ?: emptyList()
                trySend(users)
            }
        awaitClose { listener.remove() }
    }

    private fun calculateRankTier(coins: Long): RankTier = when {
        coins >= 100_000 -> RankTier.SUPER_PLATINUM
        coins >= 10_000 -> RankTier.PLATINUM
        coins >= 5_000 -> RankTier.DIAMOND
        coins >= 1_000 -> RankTier.SILVER
        coins >= 500 -> RankTier.BRONZE
        else -> RankTier.NON
    }
}
`
  }
];
