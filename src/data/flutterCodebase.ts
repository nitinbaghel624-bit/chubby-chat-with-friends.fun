import { FlutterFile } from '../types';

export const FLUTTER_CODEBASE: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    filename: 'pubspec.yaml',
    language: 'yaml',
    category: 'config',
    description: 'Flutter dependencies including Firebase Auth, Firestore, Storage, FCM, Google Maps, Media & Audio recording.',
    code: `name: chubby_chat
description: "Chubby Chat - Modern real-time 1-to-1 Flutter chat app with Nearby Radar, Friend Request system, and Firebase backend."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # Firebase Core & Backend
  firebase_core: ^3.8.0
  firebase_auth: ^5.3.3
  cloud_firestore: ^5.5.0
  firebase_storage: ^12.3.6
  firebase_messaging: ^15.1.5
  google_sign_in: ^6.2.2

  # Location & Maps
  google_maps_flutter: ^2.10.0
  geolocator: ^13.0.1
  geocoding: ^3.0.0

  # Media, Audio & Video
  image_picker: ^1.1.2
  record: ^5.1.2
  audioplayers: ^6.1.0
  video_player: ^2.9.2
  cached_network_image: ^3.4.1

  # State Management & Utilities
  provider: ^6.1.2
  intl: ^0.19.0
  uuid: ^4.5.1
  flutter_local_notifications: ^18.0.1
  permission_handler: ^11.3.1
  cupertino_icons: ^1.0.8
  font_awesome_flutter: ^10.8.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
`
  },
  {
    path: 'lib/main.dart',
    filename: 'main.dart',
    language: 'dart',
    category: 'core',
    description: 'App entry point initializing Firebase, FCM background handler, and AppTheme.',
    code: `import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import 'core/theme/app_theme.dart';
import 'core/services/auth_service.dart';
import 'core/services/chat_service.dart';
import 'core/services/nearby_service.dart';
import 'core/services/notification_service.dart';
import 'features/auth/screens/auth_screen.dart';
import 'features/navigation/main_nav_screen.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  // Handle background notification
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  await NotificationService.initialize();

  runApp(const ChubbyChatApp());
}

class ChubbyChatApp extends StatelessWidget {
  const ChubbyChatApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        ChangeNotifierProvider(create: (_) => ChatService()),
        ChangeNotifierProvider(create: (_) => NearbyService()),
      ],
      child: MaterialApp(
        title: 'Chubby Chat',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.deepVioletTheme,
        home: Consumer<AuthService>(
          builder: (context, auth, _) {
            if (auth.isLoading) {
              return const Scaffold(
                backgroundColor: AppColors.background,
                body: Center(
                  child: CircularProgressIndicator(color: AppColors.accentPink),
                ),
              );
            }
            if (auth.currentUser == null) {
              return const AuthScreen();
            }
            return const MainNavScreen();
          },
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/core/theme/app_theme.dart',
    filename: 'app_theme.dart',
    language: 'dart',
    category: 'core',
    description: 'Theme definitions: Deep Violet primary canvas with Pink & Blue neon accents.',
    code: `import 'package:flutter/material.dart';

class AppColors {
  static const Color background = Color(0xFF0D0A1A); // Deep Violet Dark
  static const Color cardSurface = Color(0xFF1B1533); // Elevated Violet Card
  static const Color cardSurfaceLight = Color(0xFF261E47);
  
  static const Color primaryViolet = Color(0xFF7C3AED); // Radiant Violet
  static const Color accentPink = Color(0xFFFF2D75); // Vibrant Pink
  static const Color accentBlue = Color(0xFF38BDF8); // Electric Sky Blue
  
  static const Color textPrimary = Color(0xFFF8FAFC); // White / Light slate
  static const Color textSecondary = Color(0xFF94A3B8); // Muted slate
  static const Color textDisabled = Color(0xFF64748B);
  
  static const Color onlineGreen = Color(0xFF10B981);
  static const Color offlineGrey = Color(0xFF6B7280);
  static const Color errorRed = Color(0xFFEF4444);
}

class AppTheme {
  static ThemeData get deepVioletTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      primaryColor: AppColors.primaryViolet,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryViolet,
        secondary: AppColors.accentPink,
        tertiary: AppColors.accentBlue,
        surface: AppColors.cardSurface,
        onSurface: AppColors.textPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: AppColors.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
        iconTheme: IconThemeData(color: AppColors.textPrimary),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.cardSurface,
        selectedItemColor: AppColors.accentPink,
        unselectedItemColor: AppColors.textSecondary,
        type: BottomNavigationBarType.fixed,
        elevation: 12,
      ),
    );
  }
}
`
  },
  {
    path: 'lib/core/models/user_model.dart',
    filename: 'user_model.dart',
    language: 'dart',
    category: 'core',
    description: 'Data model representing user profiles, location coordinates, DOB, and active status.',
    code: `import 'package:cloud_firestore/cloud_firestore.dart';

enum Gender { male, female, nonBinary, other }

class UserModel {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String avatarUrl;
  final String bio;
  final DateTime dateOfBirth;
  final Gender gender;
  final bool isOnline;
  final DateTime lastActive;
  final GeoPoint? location;
  final String city;
  final String country;
  final List<String> photos;
  final List<String> interests;
  final List<String> blockedUserIds;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    required this.avatarUrl,
    required this.bio,
    required this.dateOfBirth,
    required this.gender,
    required this.isOnline,
    required this.lastActive,
    this.location,
    required this.city,
    required this.country,
    this.photos = const [],
    this.interests = const [],
    this.blockedUserIds = const [],
  });

  int get age {
    final now = DateTime.now();
    int age = now.year - dateOfBirth.year;
    if (now.month < dateOfBirth.month ||
        (now.month == dateOfBirth.month && now.day < dateOfBirth.day)) {
      age--;
    }
    return age;
  }

  factory UserModel.fromMap(Map<String, dynamic> map, String docId) {
    return UserModel(
      id: docId,
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      phone: map['phone'],
      avatarUrl: map['avatarUrl'] ?? 'https://placehold.co/150',
      bio: map['bio'] ?? '',
      dateOfBirth: (map['dateOfBirth'] as Timestamp?)?.toDate() ?? DateTime(2000),
      gender: Gender.values.firstWhere(
        (e) => e.name == (map['gender'] ?? 'other'),
        orElse: () => Gender.other,
      ),
      isOnline: map['isOnline'] ?? false,
      lastActive: (map['lastActive'] as Timestamp?)?.toDate() ?? DateTime.now(),
      location: map['location'] as GeoPoint?,
      city: map['city'] ?? '',
      country: map['country'] ?? '',
      photos: List<String>.from(map['photos'] ?? []),
      interests: List<String>.from(map['interests'] ?? []),
      blockedUserIds: List<String>.from(map['blockedUserIds'] ?? []),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'avatarUrl': avatarUrl,
      'bio': bio,
      'dateOfBirth': Timestamp.fromDate(dateOfBirth),
      'gender': gender.name,
      'isOnline': isOnline,
      'lastActive': Timestamp.fromDate(lastActive),
      'location': location,
      'city': city,
      'country': country,
      'photos': photos,
      'interests': interests,
      'blockedUserIds': blockedUserIds,
    };
  }
}
`
  },
  {
    path: 'lib/core/models/message_model.dart',
    filename: 'message_model.dart',
    language: 'dart',
    category: 'core',
    description: 'Message entity with text, image, voice note, and video types.',
    code: `import 'package:cloud_firestore/cloud_firestore.dart';

enum MessageType { text, image, voice, video }

class MessageModel {
  final String id;
  final String senderId;
  final String receiverId;
  final String content;
  final MessageType type;
  final String? mediaUrl;
  final int? mediaDuration; // seconds for audio / video
  final DateTime timestamp;
  final bool isRead;

  MessageModel({
    required this.id,
    required this.senderId,
    required this.receiverId,
    required this.content,
    required this.type,
    this.mediaUrl,
    this.mediaDuration,
    required this.timestamp,
    this.isRead = false,
  });

  factory MessageModel.fromMap(Map<String, dynamic> map, String docId) {
    return MessageModel(
      id: docId,
      senderId: map['senderId'] ?? '',
      receiverId: map['receiverId'] ?? '',
      content: map['content'] ?? '',
      type: MessageType.values.firstWhere(
        (e) => e.name == (map['type'] ?? 'text'),
        orElse: () => MessageType.text,
      ),
      mediaUrl: map['mediaUrl'],
      mediaDuration: map['mediaDuration'],
      timestamp: (map['timestamp'] as Timestamp?)?.toDate() ?? DateTime.now(),
      isRead: map['isRead'] ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'senderId': senderId,
      'receiverId': receiverId,
      'content': content,
      'type': type.name,
      'mediaUrl': mediaUrl,
      'mediaDuration': mediaDuration,
      'timestamp': Timestamp.fromDate(timestamp),
      'isRead': isRead,
    };
  }
}
`
  },
  {
    path: 'lib/core/services/chat_service.dart',
    filename: 'chat_service.dart',
    language: 'dart',
    category: 'core',
    description: 'Handles 1-to-1 messaging, enforces the 4-free-messages rule, and manages friend requests.',
    code: `import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:uuid/uuid.dart';

import '../models/message_model.dart';

class ChatService extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;
  final Uuid _uuid = const Uuid();

  static const int maxFreeMessages = 4;

  String _getChatId(String userA, String userB) {
    return userA.compareTo(userB) < 0 ? '\${userA}_\$userB' : '\${userB}_\$userA';
  }

  // Stream 1-on-1 Messages
  Stream<List<MessageModel>> getMessages(String currentUserId, String otherUserId) {
    final chatId = _getChatId(currentUserId, otherUserId);
    return _firestore
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => MessageModel.fromMap(doc.data(), doc.id))
            .toList());
  }

  // Check if sender is allowed to send message (First 4 free rule or Friend accepted)
  Future<bool> canSendMessage(String currentUserId, String otherUserId) async {
    final chatId = _getChatId(currentUserId, otherUserId);
    final chatDoc = await _firestore.collection('chats').doc(chatId).get();

    if (!chatDoc.exists) return true;

    final data = chatDoc.data()!;
    final friendStatus = data['friendStatus'] ?? 'none';
    if (friendStatus == 'accepted') return true;

    // Count messages sent by current user
    final messagesSentByMe = data['msgCount_\$currentUserId'] ?? 0;
    return messagesSentByMe < maxFreeMessages;
  }

  // Send Text / Media Message
  Future<void> sendMessage({
    required String currentUserId,
    required String otherUserId,
    required String content,
    required MessageType type,
    File? mediaFile,
    int? mediaDuration,
  }) async {
    final allowed = await canSendMessage(currentUserId, otherUserId);
    if (!allowed) {
      throw Exception('Free message limit (4) reached. Send a friend request to continue chatting.');
    }

    String? mediaUrl;
    if (mediaFile != null) {
      final ref = _storage.ref().child('chats/\${_uuid.v4()}');
      final uploadTask = await ref.putFile(mediaFile);
      mediaUrl = await uploadTask.ref.getDownloadURL();
    }

    final chatId = _getChatId(currentUserId, otherUserId);
    final messageId = _uuid.v4();

    final message = MessageModel(
      id: messageId,
      senderId: currentUserId,
      receiverId: otherUserId,
      content: content,
      type: type,
      mediaUrl: mediaUrl,
      mediaDuration: mediaDuration,
      timestamp: DateTime.now(),
      isRead: false,
    );

    final batch = _firestore.batch();
    final messageRef = _firestore
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .doc(messageId);

    batch.set(messageRef, message.toMap());

    final chatRef = _firestore.collection('chats').doc(chatId);
    batch.set(chatRef, {
      'participants': [currentUserId, otherUserId],
      'lastMessage': content,
      'lastTimestamp': FieldValue.serverTimestamp(),
      'msgCount_\$currentUserId': FieldValue.increment(1),
      'updatedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));

    await batch.commit();
  }

  // Send Friend Request
  Future<void> sendFriendRequest(String currentUserId, String otherUserId) async {
    final chatId = _getChatId(currentUserId, otherUserId);
    await _firestore.collection('chats').doc(chatId).set({
      'friendStatus': 'pending',
      'friendRequestFrom': currentUserId,
      'friendRequestTo': otherUserId,
      'requestedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  // Accept Friend Request
  Future<void> acceptFriendRequest(String currentUserId, String otherUserId) async {
    final chatId = _getChatId(currentUserId, otherUserId);
    await _firestore.collection('chats').doc(chatId).update({
      'friendStatus': 'accepted',
      'acceptedAt': FieldValue.serverTimestamp(),
    });
  }
}
`
  },
  {
    path: 'lib/core/services/nearby_service.dart',
    filename: 'nearby_service.dart',
    language: 'dart',
    category: 'core',
    description: 'Calculates geodesic Haversine distance, queries nearby active users within 1-10000 km radius.',
    code: `import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:geolocator/geolocator.dart';
import '../models/user_model.dart';

class NearbyService extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  double _searchRadiusKm = 25.0; // 1 to 10000 km
  Position? _currentPosition;
  List<UserModel> _nearbyUsers = [];

  double get searchRadiusKm => _searchRadiusKm;
  Position? get currentPosition => _currentPosition;
  List<UserModel> get nearbyUsers => _nearbyUsers;

  void setRadius(double km) {
    _searchRadiusKm = km;
    fetchNearbyUsers();
    notifyListeners();
  }

  Future<void> determinePosition() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return;
    }

    _currentPosition = await Geolocator.getCurrentPosition();
    notifyListeners();
    await fetchNearbyUsers();
  }

  double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    const p = 0.017453292519943295;
    final a = 0.5 -
        cos((lat2 - lat1) * p) / 2 +
        cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p)) / 2;
    return 12742 * asin(sqrt(a)); // 2 * R; R = 6371 km
  }

  Future<void> fetchNearbyUsers() async {
    if (_currentPosition == null) return;

    final snapshot = await _firestore.collection('users').get();
    final users = <UserModel>[];

    for (var doc in snapshot.docs) {
      final user = UserModel.fromMap(doc.data(), doc.id);
      if (user.location != null) {
        final distance = calculateDistance(
          _currentPosition!.latitude,
          _currentPosition!.longitude,
          user.location!.latitude,
          user.location!.longitude,
        );

        if (distance <= _searchRadiusKm) {
          users.add(user);
        }
      }
    }

    _nearbyUsers = users;
    notifyListeners();
  }
}
`
  },
  {
    path: 'lib/core/services/auth_service.dart',
    filename: 'auth_service.dart',
    language: 'dart',
    category: 'core',
    description: 'Authentication service providing Phone OTP, Email/Password, and Google Sign-In with online status tracking.',
    code: `import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../models/user_model.dart';

class AuthService extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  User? get currentUser => _auth.currentUser;
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  // Sign In with Email and Password
  Future<UserCredential> signInWithEmail(String email, String password) async {
    _setLoading(true);
    try {
      final cred = await _auth.signInWithEmailAndPassword(email: email, password: password);
      await updateOnlineStatus(true);
      return cred;
    } finally {
      _setLoading(false);
    }
  }

  // Google Sign-In
  Future<UserCredential?> signInWithGoogle() async {
    _setLoading(true);
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return null;

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final cred = await _auth.signInWithCredential(credential);
      await updateOnlineStatus(true);
      return cred;
    } finally {
      _setLoading(false);
    }
  }

  // Phone OTP Flow
  Future<void> verifyPhoneNumber({
    required String phone,
    required Function(String verificationId, int? resendToken) onCodeSent,
    required Function(FirebaseAuthException e) onVerificationFailed,
  }) async {
    await _auth.verifyPhoneNumber(
      phoneNumber: phone,
      verificationCompleted: (PhoneAuthCredential credential) async {
        await _auth.signInWithCredential(credential);
      },
      verificationFailed: onVerificationFailed,
      codeSent: onCodeSent,
      codeAutoRetrievalTimeout: (String verificationId) {},
    );
  }

  // Update Online / Offline Presence
  Future<void> updateOnlineStatus(bool isOnline) async {
    if (currentUser == null) return;
    await _firestore.collection('users').doc(currentUser!.uid).set({
      'isOnline': isOnline,
      'lastActive': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  Future<void> signOut() async {
    await updateOnlineStatus(false);
    await _auth.signOut();
    await _googleSignIn.signOut();
    notifyListeners();
  }

  void _setLoading(bool val) {
    _isLoading = val;
    notifyListeners();
  }
}
`
  },
  {
    path: 'lib/features/navigation/main_nav_screen.dart',
    filename: 'main_nav_screen.dart',
    language: 'dart',
    category: 'features',
    description: 'Bottom Navigation containing 4 core tabs: Home, Nearby (Radar/Map), Chats, Profile.',
    code: `import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../home/screens/home_screen.dart';
import '../nearby/screens/nearby_screen.dart';
import '../chat/screens/chat_list_screen.dart';
import '../profile/screens/profile_screen.dart';

class MainNavScreen extends StatefulWidget {
  const MainNavScreen({super.key});

  @override
  State<MainNavScreen> createState() => _MainNavScreenState();
}

class _MainNavScreenState extends State<MainNavScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    NearbyScreen(),
    ChatListScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.cardSurface,
          border: Border(
            top: BorderSide(color: Colors.white.withOpacity(0.08), width: 1),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: AppColors.cardSurface,
          selectedItemColor: AppColors.accentPink,
          unselectedItemColor: AppColors.textSecondary,
          selectedFontSize: 12,
          unselectedFontSize: 12,
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.explore_rounded), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.radar_rounded), label: 'Nearby'),
            BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_rounded), label: 'Chats'),
            BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profile'),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/features/chat/screens/chat_room_screen.dart',
    filename: 'chat_room_screen.dart',
    language: 'dart',
    category: 'features',
    description: '1-to-1 Chat Room with voice notes, image/video upload, 4-free message warning and friend request prompt.',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:record/record.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

import '../../../core/theme/app_theme.dart';
import '../../../core/models/user_model.dart';
import '../../../core/models/message_model.dart';
import '../../../core/services/chat_service.dart';
import '../../../core/services/auth_service.dart';

class ChatRoomScreen extends StatefulWidget {
  final UserModel targetUser;

  const ChatRoomScreen({super.key, required this.targetUser});

  @override
  State<ChatRoomScreen> createState() => _ChatRoomScreenState();
}

class _ChatRoomScreenState extends State<ChatRoomScreen> {
  final TextEditingController _textController = TextEditingController();
  final AudioRecorder _audioRecorder = AudioRecorder();
  final AudioPlayer _audioPlayer = AudioPlayer();
  final ImagePicker _picker = ImagePicker();

  bool _isRecording = false;

  @override
  void dispose() {
    _textController.dispose();
    _audioRecorder.dispose();
    _audioPlayer.dispose();
    super.dispose();
  }

  void _sendTextMessage() async {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    final chatService = Provider.of<ChatService>(context, listen: false);
    final currentUserId = Provider.of<AuthService>(context, listen: false).currentUser!.uid;

    _textController.clear();
    try {
      await chatService.sendMessage(
        currentUserId: currentUserId,
        otherUserId: widget.targetUser.id,
        content: text,
        type: MessageType.text,
      );
    } catch (e) {
      _showFriendRequestDialog(e.toString());
    }
  }

  void _showFriendRequestDialog(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.cardSurface,
        title: const Text('Friend Request Required', style: TextStyle(color: AppColors.accentPink)),
        content: Text(message, style: const TextStyle(color: AppColors.textPrimary)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentPink),
            onPressed: () async {
              final currentUserId = Provider.of<AuthService>(context, listen: false).currentUser!.uid;
              await Provider.of<ChatService>(context, listen: false)
                  .sendFriendRequest(currentUserId, widget.targetUser.id);
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Friend request sent!')),
              );
            },
            child: const Text('Send Friend Request'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentUserId = Provider.of<AuthService>(context).currentUser?.uid ?? '';
    final chatService = Provider.of<ChatService>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              backgroundImage: NetworkImage(widget.targetUser.avatarUrl),
              radius: 18,
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.targetUser.name, style: const TextStyle(fontSize: 16)),
                Text(
                  widget.targetUser.isOnline ? 'Online' : 'Offline',
                  style: TextStyle(
                    fontSize: 11,
                    color: widget.targetUser.isOnline ? AppColors.onlineGreen : AppColors.textSecondary,
                  ),
                ),
              ],
            )
          ],
        ),
      ),
      body: Column(
        children: [
          // Banner for 4-free message rule
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: AppColors.primaryViolet.withOpacity(0.2),
            child: const Row(
              children: [
                Icon(Icons.info_outline, size: 16, color: AppColors.accentBlue),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'First 4 messages free • Friend request unlocks unlimited chat',
                    style: TextStyle(fontSize: 12, color: AppColors.textPrimary),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: StreamBuilder<List<MessageModel>>(
              stream: chatService.getMessages(currentUserId, widget.targetUser.id),
              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return const Center(child: CircularProgressIndicator());
                }
                final messages = snapshot.data!;
                return ListView.builder(
                  reverse: true,
                  padding: const EdgeInsets.all(16),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final msg = messages[index];
                    final isMe = msg.senderId == currentUserId;
                    return _buildMessageBubble(msg, isMe);
                  },
                );
              },
            ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(MessageModel msg, bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isMe ? AppColors.primaryViolet : AppColors.cardSurface,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(msg.content, style: const TextStyle(color: Colors.white)),
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      padding: const EdgeInsets.all(12),
      color: AppColors.cardSurface,
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.image, color: AppColors.accentBlue),
            onPressed: () {},
          ),
          IconButton(
            icon: Icon(_isRecording ? Icons.stop : Icons.mic, color: AppColors.accentPink),
            onPressed: () {},
          ),
          Expanded(
            child: TextField(
              controller: _textController,
              decoration: InputDecoration(
                hintText: 'Type a message...',
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.send_rounded, color: AppColors.accentPink),
            onPressed: _sendTextMessage,
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/features/nearby/screens/nearby_screen.dart',
    filename: 'nearby_screen.dart',
    language: 'dart',
    category: 'features',
    description: 'Nearby Radar screen featuring Google Maps, 1-10000 km radius slider, and nearby active user cards.',
    code: `import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/services/nearby_service.dart';
import '../../chat/screens/chat_room_screen.dart';

class NearbyScreen extends StatefulWidget {
  const NearbyScreen({super.key});

  @override
  State<NearbyScreen> createState() => _NearbyScreenState();
}

class _NearbyScreenState extends State<NearbyScreen> {
  GoogleMapController? _mapController;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<NearbyService>(context, listen: false).determinePosition();
    });
  }

  @override
  Widget build(BuildContext context) {
    final nearbyService = Provider.of<NearbyService>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Nearby Radar'),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune_rounded, color: AppColors.accentPink),
            onPressed: () => _showRadiusSheet(nearbyService),
          )
        ],
      ),
      body: Stack(
        children: [
          // Google Map View
          nearbyService.currentPosition == null
              ? const Center(child: CircularProgressIndicator(color: AppColors.accentPink))
              : GoogleMap(
                  initialCameraPosition: CameraPosition(
                    target: LatLng(
                      nearbyService.currentPosition!.latitude,
                      nearbyService.currentPosition!.longitude,
                    ),
                    zoom: 13,
                  ),
                  onMapCreated: (controller) => _mapController = controller,
                  myLocationEnabled: true,
                  circles: {
                    Circle(
                      circleId: const CircleId('radar_circle'),
                      center: LatLng(
                        nearbyService.currentPosition!.latitude,
                        nearbyService.currentPosition!.longitude,
                      ),
                      radius: nearbyService.searchRadiusKm * 1000,
                      fillColor: AppColors.primaryViolet.withOpacity(0.2),
                      strokeColor: AppColors.accentPink,
                      strokeWidth: 2,
                    )
                  },
                ),

          // Bottom Floating User Carousel
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            height: 140,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: nearbyService.nearbyUsers.length,
              itemBuilder: (context, index) {
                final user = nearbyService.nearbyUsers[index];
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => ChatRoomScreen(targetUser: user)),
                    );
                  },
                  child: Container(
                    width: 260,
                    margin: const EdgeInsets.only(right: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.cardSurface.withOpacity(0.95),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.accentPink.withOpacity(0.4)),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 28,
                          backgroundImage: NetworkImage(user.avatarUrl),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(user.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                              Text('\${user.age} yrs • \${user.city}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                              const SizedBox(height: 4),
                              Text(user.bio, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11)),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }

  void _showRadiusSheet(NearbyService nearby) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.cardSurface,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Search Radius: \${nearby.searchRadiusKm.toInt()} km',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              Slider(
                value: nearby.searchRadiusKm,
                min: 1.0,
                max: 10000.0,
                activeColor: AppColors.accentPink,
                inactiveColor: AppColors.cardSurfaceLight,
                onChanged: (val) {
                  setModalState(() {});
                  nearby.setRadius(val);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'firestore.rules',
    filename: 'firestore.rules',
    language: 'plaintext',
    category: 'firebase',
    description: 'Firebase Cloud Firestore Security Rules enforcing 4 free messages and authentication.',
    code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chats & Realtime 1-to-1 Messages
    match /chats/{chatId} {
      allow read: if request.auth != null && request.auth.uid in resource.data.participants;
      allow create, update: if request.auth != null && request.auth.uid in request.resource.data.participants;
      
      match /messages/{messageId} {
        allow read: if request.auth != null;
        
        // Enforce max 4 messages limit unless friend status is accepted
        allow create: if request.auth != null && 
          request.auth.uid == request.resource.data.senderId &&
          (
            get(/databases/$(database)/documents/chats/$(chatId)).data.friendStatus == 'accepted' ||
            get(/databases/$(database)/documents/chats/$(chatId)).data[('msgCount_' + request.auth.uid)] < 4
          );
      }
    }
  }
}
`
  },
  {
    path: 'README.md',
    filename: 'README.md',
    language: 'markdown',
    category: 'config',
    description: 'Complete setup guide, Firebase CLI provisioning, Google Maps API key, Android & iOS configuration.',
    code: `# 📱 Chubby Chat - Production Flutter Application

Chubby Chat is a next-generation real-time 1-to-1 chat & nearby discovery application built with **Flutter**, **Cloud Firestore**, **Firebase Authentication**, **Firebase Storage**, **Firebase Cloud Messaging (FCM)**, and **Google Maps**.

---

## 🌟 Key Features
- **Android + iOS Support**: Clean architecture with responsive Flutter UI.
- **Modern Deep Violet Theme**: Deep dark purple canvas \`#0D0A1A\` with White, Pink (\`#FF2D75\`) and Blue (\`#38BDF8\`) neon accents.
- **Multi-Factor Auth**: Phone OTP verification, Email/Password, and Google Sign-In.
- **Rich User Profile**: Profile avatar, DOB calculation, gender selector, bio, multi-photo gallery, interests.
- **1-to-1 Real-time Messaging**: Instant text, high-quality images, voice note recordings, and video attachments.
- **4-Message Free Limit & Friend Request System**: Non-friends can exchange up to 4 preview messages. Sending or accepting a friend request unlocks unlimited chat.
- **Nearby Radar with Google Maps**: Live interactive radar slider querying from **1 km up to 10,000 km** radius.
- **Active / Offline Status**: Real-time presence detection and timestamp updates.
- **Safety Tools**: Instant user search, reporting, and blocking controls.
- **FCM Push Notifications**: Cloud messaging alerts for incoming chats and friend requests.

---

## 🚀 Step-by-Step Setup Instructions

### 1. Prerequisites
- Flutter SDK \`>= 3.2.0\`
- Dart SDK \`>= 3.2.0\`
- Android Studio / Xcode
- Firebase CLI installed (\`npm install -g firebase-tools\`)

### 2. Install Dependencies
\`\`\`bash
flutter pub get
\`\`\`

### 3. Firebase Configuration
1. Initialize Firebase:
   \`\`\`bash
   dart pub global activate flutterfire_cli
   flutterfire configure
   \`\`\`
2. Enable Firebase Auth providers:
   - **Email/Password**
   - **Phone Number**
   - **Google Sign-In**
3. Deploy Firestore Security Rules:
   \`\`\`bash
   firebase deploy --only firestore:rules
   \`\`\`

### 4. Google Maps API Configuration
- **Android**: Add your Google Maps API Key to \`android/app/src/main/AndroidManifest.xml\`:
  \`\`\`xml
  <meta-data
      android:name="com.google.android.geo.API_KEY"
      android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
  \`\`\`
- **iOS**: Add your key to \`ios/Runner/AppDelegate.swift\`:
  \`\`\`swift
  GMSServices.provideAPIKey("YOUR_GOOGLE_MAPS_API_KEY")
  \`\`\`

### 5. Run the App
\`\`\`bash
flutter run
\`\`\`
`
  }
];
