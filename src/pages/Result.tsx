import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileDown, Copy, Check, ArrowLeft, RefreshCw, Edit, Save, Smartphone } from 'lucide-react';

import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import CodeExample from '@/components/CodeExample';
import LanguageToggle from '@/components/LanguageToggle';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

// Mock response structure - in a real app, this would come from the API
interface GeneratedFile {
  name: string;
  content: string;
  language: string;
}

interface GeneratedResponse {
  files: GeneratedFile[];
  instructions: string;
}

// Mock data for example files
const mockResponses: Record<string, GeneratedResponse> = {
  "kotlin-todo": {
    files: [
      {
        name: "MainActivity.kt",
        content: `package com.example.todoapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.todoapp.ui.theme.TodoAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TodoAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    TodoApp()
                }
            }
        }
    }
}

@Composable
fun TodoApp(viewModel: TodoViewModel = viewModel()) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Todo App") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.showAddDialog = true },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Text("+", style = MaterialTheme.typography.titleLarge)
            }
        }
    ) { padding ->
        TodoList(
            todoItems = viewModel.todoItems,
            onCheckedChange = viewModel::toggleTodoItem,
            onRemoveItem = viewModel::removeTodoItem,
            modifier = Modifier.padding(padding)
        )
        
        if (viewModel.showAddDialog) {
            AddTodoDialog(
                onDismiss = { viewModel.showAddDialog = false },
                onConfirm = { 
                    viewModel.addTodoItem(it)
                    viewModel.showAddDialog = false
                }
            )
        }
    }
}`,
        language: "kotlin"
      },
      {
        name: "TodoViewModel.kt",
        content: `package com.example.todoapp

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

class TodoViewModel : ViewModel() {
    // List of todo items
    private val _todoItems = mutableStateListOf<TodoItem>()
    val todoItems: List<TodoItem> = _todoItems
    
    // Dialog visibility state
    var showAddDialog by mutableStateOf(false)
        
    // Add a new todo item
    fun addTodoItem(text: String) {
        if (text.isNotBlank()) {
            _todoItems.add(TodoItem(text = text))
        }
    }
    
    // Toggle completion status
    fun toggleTodoItem(item: TodoItem) {
        val index = _todoItems.indexOfFirst { it.id == item.id }
        if (index != -1) {
            _todoItems[index] = _todoItems[index].copy(
                isCompleted = !_todoItems[index].isCompleted
            )
        }
    }
    
    // Remove a todo item
    fun removeTodoItem(item: TodoItem) {
        _todoItems.removeAll { it.id == item.id }
    }
}

// Data class representing a single todo item
data class TodoItem(
    val id: String = java.util.UUID.randomUUID().toString(),
    val text: String,
    val isCompleted: Boolean = false
)`,
        language: "kotlin"
      },
      {
        name: "TodoComponents.kt",
        content: `package com.example.todoapp

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog

@Composable
fun TodoList(
    todoItems: List<TodoItem>,
    onCheckedChange: (TodoItem) -> Unit,
    onRemoveItem: (TodoItem) -> Unit,
    modifier: Modifier = Modifier
) {
    if (todoItems.isEmpty()) {
        Box(
            modifier = modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text(
                "No tasks yet. Add one!",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    } else {
        LazyColumn(
            modifier = modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(todoItems) { item ->
                TodoItem(
                    item = item,
                    onCheckedChange = { onCheckedChange(item) },
                    onRemoveItem = { onRemoveItem(item) }
                )
            }
        }
    }
}

@Composable
fun TodoItem(
    item: TodoItem,
    onCheckedChange: () -> Unit,
    onRemoveItem: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = item.isCompleted,
                onCheckedChange = { onCheckedChange() }
            )
            
            Text(
                text = item.text,
                style = MaterialTheme.typography.bodyLarge,
                textDecoration = if (item.isCompleted) 
                    TextDecoration.LineThrough else TextDecoration.None,
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 8.dp)
            )
            
            IconButton(onClick = onRemoveItem) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Delete",
                    tint = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}

@Composable
fun AddTodoDialog(
    onDismiss: () -> Unit,
    onConfirm: (String) -> Unit
) {
    var text by remember { mutableStateOf("") }
    
    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    "Add a new task",
                    style = MaterialTheme.typography.titleLarge
                )
                
                OutlinedTextField(
                    value = text,
                    onValueChange = { text = it },
                    label = { Text("Task") },
                    modifier = Modifier.fillMaxWidth()
                )
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("Cancel")
                    }
                    
                    Button(
                        onClick = { onConfirm(text) },
                        enabled = text.isNotBlank()
                    ) {
                        Text("Add")
                    }
                }
            }
        }
    }
}`,
        language: "kotlin"
      }
    ],
    instructions: `# How to Run the Todo App

## Setup
1. Create a new project in Android Studio by selecting "Empty Activity" template.
2. Replace the auto-generated files with the provided files.
3. Make sure you have the latest version of Compose dependencies in your build.gradle file:

\`\`\`gradle
dependencies {
    implementation 'androidx.core:core-ktx:1.10.1'
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.6.1'
    implementation 'androidx.activity:activity-compose:1.7.2'
    implementation platform('androidx.compose:compose-bom:2023.06.01')
    implementation 'androidx.compose.ui:ui'
    implementation 'androidx.compose.ui:ui-graphics'
    implementation 'androidx.compose.ui:ui-tooling-preview'
    implementation 'androidx.compose.material3:material3'
    implementation 'androidx.lifecycle:lifecycle-viewmodel-compose:2.6.1'
}
\`\`\`

## Project Structure
- **MainActivity.kt**: Main entry point of the app, sets up the UI structure.
- **TodoViewModel.kt**: Handles state management and business logic.
- **TodoComponents.kt**: Contains composable functions for UI components.

## Features
- View a list of todo items
- Add new todo items
- Mark items as completed/uncompleted
- Delete items

## Running the App
1. Connect an Android device or start an emulator
2. Click the "Run" button in Android Studio
3. The app should start automatically on your device/emulator`
  },
  "swift-rss": {
    files: [
      {
        name: "ContentView.swift",
        content: `import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = FeedViewModel()
    
    var body: some View {
        NavigationView {
            List {
                ForEach(viewModel.articles) { article in
                    NavigationLink(destination: ArticleDetailView(article: article)) {
                        ArticleRowView(article: article)
                    }
                }
            }
            .listStyle(PlainListStyle())
            .refreshable {
                await viewModel.fetchFeed()
            }
            .navigationTitle("RSS Reader")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        Task {
                            await viewModel.fetchFeed()
                        }
                    }) {
                        Image(systemName: "arrow.clockwise")
                    }
                }
            }
            .overlay {
                if viewModel.isLoading {
                    ProgressView("Loading...")
                }
            }
            .alert("Error", isPresented: $viewModel.showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(viewModel.errorMessage)
            }
            .task {
                await viewModel.fetchFeed()
            }
        }
    }
}

struct ArticleRowView: View {
    let article: Article
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(article.title)
                .font(.headline)
                .lineLimit(2)
            
            Text(article.description)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .lineLimit(3)
            
            HStack {
                if let pubDate = article.formattedDate {
                    Text(pubDate)
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                if article.hasImage {
                    Image(systemName: "photo")
                        .foregroundColor(.blue)
                }
            }
        }
        .padding(.vertical, 8)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}`,
        language: "swift"
      },
      {
        name: "ArticleDetailView.swift",
        content: `import SwiftUI

struct ArticleDetailView: View {
    let article: Article
    @State private var isLoading = false
    @Environment(\\.openURL) private var openURL
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text(article.title)
                    .font(.title)
                    .fontWeight(.bold)
                
                if let date = article.formattedDate {
                    Text(date)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                }
                
                if let imageUrl = article.imageUrl, article.hasImage {
                    AsyncImage(url: imageUrl) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                                .frame(height: 200)
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(height: 200)
                                .clipped()
                        case .failure:
                            Image(systemName: "photo")
                                .frame(height: 200)
                                .foregroundColor(.gray)
                                .background(Color.gray.opacity(0.2))
                        @unknown default:
                            EmptyView()
                        }
                    }
                    .cornerRadius(8)
                }
                
                Text(article.description)
                    .font(.body)
                
                if let content = article.content {
                    Text(content)
                        .font(.body)
                        .padding(.top, 8)
                }
                
                Divider()
                
                Button(action: {
                    if let url = article.url {
                        openURL(url)
                    }
                }) {
                    HStack {
                        Text("Read Full Article")
                        Spacer()
                        Image(systemName: "safari")
                    }
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
                }
            }
            .padding()
        }
        .navigationBarTitleDisplayMode(.inline)
    }
}`,
        language: "swift"
      },
      {
        name: "FeedViewModel.swift",
        content: `import Foundation
import Combine

class FeedViewModel: ObservableObject {
    @Published var articles: [Article] = []
    @Published var isLoading = false
    @Published var showError = false
    @Published var errorMessage = ""
    
    private let feedURL = URL(string: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml")!
    private var cancellables = Set<AnyCancellable>()
    
    func fetchFeed() async {
        await MainActor.run {
            isLoading = true
        }
        
        do {
            let (data, _) = try await URLSession.shared.data(from: feedURL)
            let parser = FeedParser()
            let parsedArticles = parser.parse(data: data)
            
            await MainActor.run {
                self.articles = parsedArticles
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.isLoading = false
                self.errorMessage = "Failed to load RSS feed: \\(error.localizedDescription)"
                self.showError = true
            }
        }
    }
}

class FeedParser {
    func parse(data: Data) -> [Article] {
        // In a real app, you'd use XMLParser to parse the RSS feed
        // For this example, we'll return mock data
        return [
            Article(
                id: UUID().uuidString,
                title: "New AI Technology Revolutionizes Mobile App Development",
                description: "Researchers have developed a new AI system that can generate complete mobile applications from simple descriptions.",
                content: "The technology, called AppGenius, uses advanced machine learning techniques to understand user requirements and generate fully-functional code across multiple platforms.",
                date: Date(),
                imageUrl: URL(string: "https://example.com/image1.jpg"),
                url: URL(string: "https://example.com/article1"),
                hasImage: true
            ),
            Article(
                id: UUID().uuidString,
                title: "Apple Announces New Developer Tools at WWDC",
                description: "Apple's annual developer conference unveiled several new tools aimed at improving the app development experience.",
                content: "The new suite includes improved testing frameworks, enhanced debugging capabilities, and new APIs for taking advantage of the latest hardware features.",
                date: Date().addingTimeInterval(-86400),
                imageUrl: URL(string: "https://example.com/image2.jpg"),
                url: URL(string: "https://example.com/article2"),
                hasImage: true
            ),
            Article(
                id: UUID().uuidString,
                title: "Mobile App Privacy Concerns on the Rise",
                description: "A new study shows increasing concern among users about data collection practices in mobile applications.",
                content: "The survey of over 5,000 smartphone users revealed that 78% are worried about how their personal data is being used, with 65% having declined to download an app due to privacy concerns.",
                date: Date().addingTimeInterval(-172800),
                imageUrl: nil,
                url: URL(string: "https://example.com/article3"),
                hasImage: false
            )
        ]
    }
}`,
        language: "swift"
      },
      {
        name: "Article.swift",
        content: `import Foundation

struct Article: Identifiable {
    let id: String
    let title: String
    let description: String
    let content: String?
    let date: Date?
    let imageUrl: URL?
    let url: URL?
    let hasImage: Bool
    
    var formattedDate: String? {
        guard let date = date else { return nil }
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}`,
        language: "swift"
      }
    ],
    instructions: `# RSS Reader App Implementation Guide

## Project Setup

1. Create a new SwiftUI project in Xcode
2. Add the provided Swift files to your project
3. Make sure to set the deployment target to iOS 15.0 or later (required for async/await)

## File Structure

- **ContentView.swift**: Main view that displays the list of articles
- **ArticleDetailView.swift**: Detail view for a selected article
- **FeedViewModel.swift**: Handles data fetching and business logic
- **Article.swift**: Model for article data

## Key Features

- Fetches and parses RSS feeds
- Displays articles in a list
- Shows article details in a dedicated view
- Supports pull-to-refresh
- Handles loading states and errors
- Opens full articles in Safari

## Implementation Notes

The current implementation uses mock data in the FeedParser class. In a production app, you should:

1. Implement a proper XML parser for RSS feeds (using XMLParser)
2. Add support for different RSS feed sources
3. Implement caching for offline reading
4. Add support for bookmarking favorite articles

## Running the App

1. Open the project in Xcode
2. Select a simulator or connected device
3. Press the Run button (⌘R)

## Adding Real RSS Parsing

To implement real RSS parsing, replace the mock implementation in FeedParser with a proper XML parser. Here's a starting point:

\`\`\`
func parse(data: Data) -> [Article] {
    var articles: [Article] = []
    let parser = XMLParser(data: data)
    let delegate = RSSParserDelegate()
    parser.delegate = delegate
    parser.parse()
    return delegate.articles
}
\`\`\`

Then implement a proper RSSParserDelegate class that conforms to XMLParserDelegate.`
  },
  "dart-weather": {
    files: [
      {
        name: "main.dart",
        content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'weather_service.dart';
import 'weather_model.dart';
import 'home_screen.dart';
import 'theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => WeatherProvider()),
      ],
      child: MaterialApp(
        title: 'Weather App',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        home: const HomeScreen(),
      ),
    );
  }
}`,
        language: "dart"
      },
      {
        name: "weather_model.dart",
        content: `import 'package:flutter/foundation.dart';
import 'weather_service.dart';

class WeatherInfo {
  final String cityName;
  final double temperature;
  final String condition;
  final int humidity;
  final double windSpeed;
  final String iconCode;
  final List<HourlyForecast> hourlyForecast;
  final List<DailyForecast> dailyForecast;

  WeatherInfo({
    required this.cityName,
    required this.temperature,
    required this.condition,
    required this.humidity,
    required this.windSpeed,
    required this.iconCode,
    required this.hourlyForecast,
    required this.dailyForecast,
  });

  String get weatherIcon {
    // Map icon code to appropriate icon
    // In a real app, you'd use proper icon mapping based on API responses
    switch (iconCode) {
      case '01d':
        return '☀️';
      case '02d':
      case '03d':
        return '⛅';
      case '04d':
        return '☁️';
      case '09d':
        return '🌧️';
      case '10d':
        return '🌦️';
      case '11d':
        return '⛈️';
      case '13d':
        return '❄️';
      case '50d':
        return '🌫️';
      default:
        return '☁️';
    }
  }
}

class HourlyForecast {
  final String time;
  final double temperature;
  final String iconCode;

  HourlyForecast({
    required this.time,
    required this.temperature,
    required this.iconCode,
  });

  String get weatherIcon {
    // Map icon code to emoji
    switch (iconCode) {
      case '01d':
        return '☀️';
      case '02d':
      case '03d':
        return '⛅';
      case '04d':
        return '☁️';
      case '09d':
        return '🌧️';
      case '10d':
        return '🌦️';
      case '11d':
        return '⛈️';
      case '13d':
        return '❄️';
      case '50d':
        return '🌫️';
      default:
        return '☁️';
    }
  }
}

class DailyForecast {
  final String day;
  final double maxTemp;
  final double minTemp;
  final String iconCode;

  DailyForecast({
    required this.day,
    required this.maxTemp,
    required this.minTemp,
    required this.iconCode,
  });

  String get weatherIcon {
    // Map icon code to emoji
    switch (iconCode) {
      case '01d':
        return '☀️';
      case '02d':
      case '03d':
        return '⛅';
      case '04d':
        return '☁️';
      case '09d':
        return '🌧️';
      case '10d':
        return '🌦️';
      case '11d':
        return '⛈️';
      case '13d':
        return '❄️';
      case '50d':
        return '🌫️';
      default:
        return '☁️';
    }
  }
}

class WeatherProvider with ChangeNotifier {
  WeatherInfo? _weatherInfo;
  String? _errorMessage;
  bool _isLoading = false;

  WeatherInfo? get weatherInfo => _weatherInfo;
  String? get errorMessage => _errorMessage;
  bool get isLoading => _isLoading;

  final _weatherService = WeatherService();

  Future<void> fetchWeatherData(String city) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final weatherData = await _weatherService.getWeatherData(city);
      _weatherInfo = weatherData;
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Failed to fetch weather data: \${e.toString()}';
      _weatherInfo = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchWeatherForCurrentLocation() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final weatherData = await _weatherService.getWeatherForCurrentLocation();
      _weatherInfo = weatherData;
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Failed to get location: \${e.toString()}';
      _weatherInfo = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}`,
        language: "dart"
      },
      {
        name: "weather_service.dart",
        content: `import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:location/location.dart';
import 'weather_model.dart';

class WeatherService {
  // In a real app, you would use your own API key and proper error handling
  final String apiKey = 'your_api_key_here';
  final String baseUrl = 'https://api.openweathermap.org/data/2.5';

  Future<WeatherInfo> getWeatherData(String city) async {
    // In a real app, you would make actual API calls
    // For this example, we'll return mock data
    await Future.delayed(const Duration(seconds: 1)); // Simulate network delay
    return _getMockWeatherData(city);
  }

  Future<WeatherInfo> getWeatherForCurrentLocation() async {
    final location = Location();

    bool serviceEnabled = await location.serviceEnabled();
    if (!serviceEnabled) {
      serviceEnabled = await location.requestService();
      if (!serviceEnabled) {
        throw Exception('Location services are disabled');
      }
    }

    PermissionStatus permissionGranted = await location.hasPermission();
    if (permissionGranted == PermissionStatus.denied) {
      permissionGranted = await location.requestPermission();
      if (permissionGranted != PermissionStatus.granted) {
        throw Exception('Location permissions are denied');
      }
    }

    // In a real app, you would use these coordinates to fetch weather
    // For this example, we'll return mock data for "Current Location"
    await Future.delayed(const Duration(seconds: 1)); // Simulate network delay
    return _getMockWeatherData("Current Location");
  }

  WeatherInfo _getMockWeatherData(String city) {
    // Create mock hourly forecast
    final List<HourlyForecast> hourlyForecast = [
      HourlyForecast(time: 'Now', temperature: 24, iconCode: '01d'),
      HourlyForecast(time: '1PM', temperature: 25, iconCode: '02d'),
      HourlyForecast(time: '2PM', temperature: 26, iconCode: '03d'),
      HourlyForecast(time: '3PM', temperature: 26, iconCode: '04d'),
      HourlyForecast(time: '4PM', temperature: 25, iconCode: '10d'),
      HourlyForecast(time: '5PM', temperature: 24, iconCode: '01d'),
      HourlyForecast(time: '6PM', temperature: 22, iconCode: '01d'),
      HourlyForecast(time: '7PM', temperature: 21, iconCode: '01d'),
    ];

    // Create mock daily forecast
    final List<DailyForecast> dailyForecast = [
      DailyForecast(day: 'Today', maxTemp: 26, minTemp: 18, iconCode: '01d'),
      DailyForecast(day: 'Tue', maxTemp: 28, minTemp: 19, iconCode: '01d'),
      DailyForecast(day: 'Wed', maxTemp: 27, minTemp: 20, iconCode: '02d'),
      DailyForecast(day: 'Thu', maxTemp: 25, minTemp: 18, iconCode: '10d'),
      DailyForecast(day: 'Fri', maxTemp: 24, minTemp: 17, iconCode: '09d'),
      DailyForecast(day: 'Sat', maxTemp: 23, minTemp: 16, iconCode: '01d'),
      DailyForecast(day: 'Sun', maxTemp: 24, minTemp: 16, iconCode: '01d'),
    ];

    // Return mock weather info
    return WeatherInfo(
      cityName: city,
      temperature: 24.5,
      condition: 'Clear Sky',
      humidity: 65,
      windSpeed: 5.8,
      iconCode: '01d',
      hourlyForecast: hourlyForecast,
      dailyForecast: dailyForecast,
    );
  }

  // In a real app, you would implement these methods to make actual API calls
  // Example of what that might look like:
  /*
  Future<WeatherInfo> _fetchRealWeatherData(String city) async {
    final response = await http.get(
      Uri.parse('$baseUrl/weather?q=$city&units=metric&appid=$apiKey'),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      // Parse JSON and create a WeatherInfo object
      // ...
    } else {
      throw Exception('Failed to load weather data');
    }
  }
  */
}`,
        language: "dart"
      },
      {
        name: "home_screen.dart",
        content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'weather_model.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  bool _showSearchBox = false;

  @override
  void initState() {
    super.initState();
    // Load weather for current location when app starts
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<WeatherProvider>(context, listen: false).fetchWeatherForCurrentLocation();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _searchWeather() {
    if (_searchController.text.isNotEmpty) {
      Provider.of<WeatherProvider>(context, listen: false)
          .fetchWeatherData(_searchController.text);
      FocusScope.of(context).unfocus();
      setState(() {
        _showSearchBox = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final weatherProvider = Provider.of<WeatherProvider>(context);
    final weatherInfo = weatherProvider.weatherInfo;
    
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            _buildAppBar(context),
            Expanded(
              child: weatherProvider.isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : weatherProvider.errorMessage != null
                      ? _buildErrorMessage(weatherProvider.errorMessage!)
                      : weatherInfo != null
                          ? _buildWeatherContent(context, weatherInfo)
                          : const Center(child: Text('No weather data available')),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          if (!_showSearchBox) ... [
            Text(
              'Weather App',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.location_on),
                  onPressed: () {
                    Provider.of<WeatherProvider>(context, listen: false)
                        .fetchWeatherForCurrentLocation();
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: () {
                    setState(() {
                      _showSearchBox = true;
                    });
                  },
                ),
              ],
            ),
          ] else ... [
            Expanded(
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Search for a city...',
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.search),
                    onPressed: _searchWeather,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                ),
                onSubmitted: (_) => _searchWeather(),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.close),
              onPressed: () {
                setState(() {
                  _showSearchBox = false;
                });
              },
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildErrorMessage(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              color: Colors.red,
              size: 60,
            ),
            const SizedBox(height: 16),
            Text(
              'Error',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                Provider.of<WeatherProvider>(context, listen: false)
                    .fetchWeatherForCurrentLocation();
              },
              child: const Text('Try Again'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeatherContent(BuildContext context, WeatherInfo weatherInfo) {
    return RefreshIndicator(
      onRefresh: () async {
        await Provider.of<WeatherProvider>(context, listen: false)
            .fetchWeatherData(weatherInfo.cityName);
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Container(
          height: MediaQuery.of(context).size.height - 100, // Approximate app bar height
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              _buildCurrentWeather(context, weatherInfo),
              const SizedBox(height: 20),
              _buildHourlyForecast(context, weatherInfo),
              const SizedBox(height: 20),
              _buildDailyForecast(context, weatherInfo),
              const SizedBox(height: 20),
              _buildWeatherDetails(context, weatherInfo),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentWeather(BuildContext context, WeatherInfo weatherInfo) {
    final theme = Theme.of(context);
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              weatherInfo.cityName,
              style: theme.textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  weatherInfo.temperature.toStringAsFixed(1),
                  style: theme.textTheme.displayMedium,
                ),
                Text(
                  '°C',
                  style: theme.textTheme.headlineSmall,
                ),
              ],
            ),
            Text(
              weatherInfo.weatherIcon,
              style: const TextStyle(fontSize: 60),
            ),
            Text(
              weatherInfo.condition,
              style: theme.textTheme.bodyLarge,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHourlyForecast(BuildContext context, WeatherInfo weatherInfo) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Hourly Forecast',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 120,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: weatherInfo.hourlyForecast.length,
            itemBuilder: (context, index) {
              final hourForecast = weatherInfo.hourlyForecast[index];
              return Card(
                margin: const EdgeInsets.only(right: 16),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  width: 80,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(hourForecast.time),
                      const SizedBox(height: 8),
                      Text(
                        hourForecast.weatherIcon,
                        style: const TextStyle(fontSize: 24),
                      ),
                      const SizedBox(height: 8),
                      Text('\${hourForecast.temperature.toStringAsFixed(0)}°C'),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDailyForecast(BuildContext context, WeatherInfo weatherInfo) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '7-Day Forecast',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 8),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: weatherInfo.dailyForecast.length,
          itemBuilder: (context, index) {
            final dayForecast = weatherInfo.dailyForecast[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    SizedBox(
                      width: 50,
                      child: Text(
                        dayForecast.day,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    Text(
                      dayForecast.weatherIcon,
                      style: const TextStyle(fontSize: 20),
                    ),
                    Row(
                      children: [
                        Text('\${dayForecast.maxTemp.toStringAsFixed(0)}°'),
                        const SizedBox(width: 8),
                        Text(
                          '\${dayForecast.minTemp.toStringAsFixed(0)}°',
                          style: const TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildWeatherDetails(BuildContext context, WeatherInfo weatherInfo) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Weather Details',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildDetailItem(
                  context,
                  Icons.water_drop_outlined,
                  'Humidity',
                  '\${weatherInfo.humidity}%',
                ),
                _buildDetailItem(
                  context,
                  Icons.air,
                  'Wind Speed',
                  '\${weatherInfo.windSpeed} m/s',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem(
      BuildContext context, IconData icon, String label, String value) {
    return Column(
      children: [
        Icon(icon, size: 24),
        const SizedBox(height: 8),
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: Theme.of(context).textTheme.titleMedium,
        ),
      ],
    );
  }
}`,
        language: "dart"
      },
      {
        name: "theme.dart",
        content: `import 'package:flutter/material.dart';

class AppTheme {
  static final ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.light,
    ),
    appBarTheme: const AppBarTheme(
      centerTitle: true,
      backgroundColor: Colors.transparent,
      elevation: 0,
    ),
    cardTheme: CardTheme(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.blue, width: 2),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
  );

  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.dark,
    ),
    appBarTheme: const AppBarTheme(
      centerTitle: true,
      backgroundColor: Colors.transparent,
      elevation: 0,
    ),
    cardTheme: CardTheme(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.blue.shade300, width: 2),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
  );
}`,
        language: "dart"
      }
    ],
    instructions: `# Flutter Weather App Implementation Guide

## Project Setup

1. Create a new Flutter project: 
   \`\`\`
   flutter create weather_app
   \`\`\`

2. Add dependencies to pubspec.yaml:
   \`\`\`yaml
   dependencies:
     flutter:
       sdk: flutter
     provider: ^6.0.5
     http: ^1.1.0
     location: ^5.0.0
   \`\`\`

3. Run \`flutter pub get\` to install dependencies

## File Structure

Copy the provided files into your project's lib folder:
- main.dart: Entry point of the application
- weather_model.dart: Data models and state management
- weather_service.dart: API service for fetching weather data
- home_screen.dart: Main UI screen
- theme.dart: App theme configuration

## Key Features

1. **Current Weather Display**
   - Shows temperature, condition, and weather icon
   - Displays city name

2. **Hourly Forecast**
   - Horizontal scrolling list of hourly predictions
   - Shows time, icon, and temperature

3. **7-Day Forecast**
   - Daily weather predictions
   - Shows min/max temperatures and conditions

4. **Weather Details**
   - Additional information like humidity and wind speed

5. **Location Support**
   - Get weather for current location
   - Search for weather by city name

## Implementation Notes

1. This implementation uses mock data for demonstration. In a production app:
   - Replace the API key in weather_service.dart with your actual OpenWeatherMap API key
   - Implement the real API calls in the weather_service.dart file
   - Add proper error handling and loading states

2. Location permission handling:
   - The app requests location permissions when trying to get the current location
   - On Android, update AndroidManifest.xml to include:
     \`\`\`xml
     <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
     <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
     \`\`\`
   - On iOS, update Info.plist to include:
     \`\`\`xml
     <key>NSLocationWhenInUseUsageDescription</key>
     <string>This app needs access to location to show weather information.</string>
     \`\`\`

## Running the App

Run the app with:
\`\`\`
flutter run
\`\`\`

## Future Improvements

1. Add settings for temperature units (Celsius/Fahrenheit)
2. Implement weather notifications
3. Add more detailed weather information
4. Add animations for weather conditions
5. Implement caching for offline use`
  }
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt, language, isExample } = location.state || {};
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('code');
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [instructions, setInstructions] = useState('');
  const [activeFile, setActiveFile] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(prompt || '');

  // Determine which mock response to use based on language and prompt (for examples)
  const getMockResponse = (lang: string, isExample: boolean) => {
    if (isExample) {
      if (lang === 'kotlin') return mockResponses['kotlin-todo'];
      if (lang === 'swift') return mockResponses['swift-rss'];
      if (lang === 'dart') return mockResponses['dart-weather'];
    }
    
    // Return default based just on language
    if (lang === 'kotlin') return mockResponses['kotlin-todo'];
    if (lang === 'swift') return mockResponses['swift-rss'];
    return mockResponses['dart-weather'];
  };

  useEffect(() => {
    if (!prompt && !isExample) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be an actual API call using the payload format
        // and API key provided in the requirements
        /*
        const payload = {
          "input_value": prompt,
          "output_type": "chat",
          "input_type": "chat",
          "session_id": "user_1"
        };

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer AstraCS:pphpoowOPIkzBHZJfdQRANsG:b8a5224b6cd0b79b41e27f9c24c1e48bdbf79486b40f5099f22ded3e9e75bbef'
          },
          body: JSON.stringify(payload)
        };

        const response = await fetch('https://api.langflow.astra.datastax.com/lf/b86dc523-be95-4f42-805d-c135e0df97e3/api/v1/run/1cd0cec8-a62c-4488-904f-c3733e35c5cf', options);
        const data = await response.json();
        */
        
        // For now, we'll use mock data
        const mockResponse = getMockResponse(language, isExample);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setFiles(mockResponse.files);
        setInstructions(mockResponse.instructions);
        setActiveFile(0);
      } catch (error) {
        console.error('Error generating code:', error);
        toast.error("Failed to generate code. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [prompt, language, isExample, navigate]);

  const handleDownloadZip = () => {
    // In a real implementation, this would create and download a zip file
    toast.success("Downloading code as ZIP file...");
    
    // Simulating download delay
    setTimeout(() => {
      toast.success("Download complete!");
    }, 2000);
  };

  const handleCopyAllCode = () => {
    // Copy all code from all files to clipboard
    const allCode = files.map(file => `// File: ${file.name}\n\n${file.content}`).join('\n\n');
    navigator.clipboard.writeText(allCode);
    toast.success("All code copied to clipboard!");
  };

  const handleRegenerateCode = async () => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get new mock data
      const mockResponse = getMockResponse(language, false);
      
      setFiles(mockResponse.files);
      setInstructions(mockResponse.instructions);
      setActiveFile(0);
      toast.success("Code regenerated successfully!");
    } catch (error) {
      console.error('Error regenerating code:', error);
      toast.error("Failed to regenerate code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes and regenerate
      handleRegenerateCode();
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex justify-between items-center py-4">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageToggle 
              language={language} 
              setLanguage={() => {}} 
              className="w-64" 
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-6 text-primary" />
              <h3 className="text-2xl font-semibold mb-2">Generating Code</h3>
              <p className="text-muted-foreground">This may take a moment...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Left panel - Prompt & Instructions */}
            <div className="md:w-2/5 border-r overflow-y-auto">
              <div className="p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Your Prompt</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={toggleEditMode}
                    >
                      {isEditing ? (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isEditing ? (
                    <Textarea
                      value={editedPrompt}
                      onChange={(e) => setEditedPrompt(e.target.value)}
                      className="min-h-24 mb-4"
                    />
                  ) : (
                    <div className="bg-muted p-4 rounded-md mb-6">
                      <p className="text-sm">{prompt}</p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateCode}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Code
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Implementation Guide</h3>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: instructions.replace(/\n/g, '<br>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>') }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel - Code View */}
            <div className="md:w-3/5 flex flex-col h-full">
              <div className="border-b p-4 flex justify-between">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList>
                    <TabsTrigger value="code">Generated Code</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleCopyAllCode}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleDownloadZip}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </Tabs>
              </div>

              <TabsContent value="code" className="flex-1 flex flex-col p-4 mt-0">
                {files.length > 0 && (
                  <>
                    <div className="border rounded-md mb-4 overflow-x-auto">
                      <div className="flex p-1 bg-muted">
                        {files.map((file, index) => (
                          <Button
                            key={index}
                            variant={activeFile === index ? "secondary" : "ghost"}
                            size="sm"
                            className="text-xs"
                            onClick={() => setActiveFile(index)}
                          >
                            {file.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <CodeExample 
                        code={files[activeFile].content}
                        language={files[activeFile].language}
                        fileName={files[activeFile].name}
                      />
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="preview" className="flex-1 p-4 mt-0">
                <div className="border rounded-md h-full flex items-center justify-center p-8 bg-muted">
                  <div className="text-center">
                    <Smartphone className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Mobile Preview</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Preview is only available in a real mobile development environment.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Download the code and open it in Android Studio, Xcode, or Flutter to see a live preview.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </>
        )}
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Logo className="text-sm" />
            <span className="text-sm text-muted-foreground">© 2025 App Genesis. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <Button variant="link" size="sm" className="text-muted-foreground">Terms</Button>
            <Button variant="link" size="sm" className="text-muted-foreground">Privacy</Button>
            <Button variant="link" size="sm" className="text-muted-foreground">Contact</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Result;
