
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
  "example-default": {
    files: [
      {
        name: "README.md",
        content: "# Example Project\n\nThis is a placeholder for the generated project.",
        language: "markdown"
      }
    ],
    instructions: "This is a default example with minimal content."
  },
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
                  prefixIcon: IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () {
                      setState(() {
                        _showSearchBox = false;
                      });
                      _searchController.clear();
                    },
                  ),
                ),
                onSubmitted: (_) => _searchWeather(),
                autofocus: true,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorMessage(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.error_outline,
              color: Colors.red,
              size: 48,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16),
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
    final theme = Theme.of(context);
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            weatherInfo.cityName,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            weatherInfo.condition,
            style: theme.textTheme.titleLarge,
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '\${weatherInfo.temperature.toStringAsFixed(1)}°',
                style: theme.textTheme.displayLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                weatherInfo.weatherIcon,
                style: theme.textTheme.displayMedium,
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildWeatherDetails(weatherInfo),
          const SizedBox(height: 24),
          _buildHourlyForecast(weatherInfo),
          const SizedBox(height: 24),
          _buildDailyForecast(weatherInfo),
        ],
      ),
    );
  }

  Widget _buildWeatherDetails(WeatherInfo weatherInfo) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _buildDetailItem(
          icon: Icons.water_drop,
          value: '\${weatherInfo.humidity}%',
          label: 'Humidity'
        ),
        _buildDetailItem(
          icon: Icons.air,
          value: '\${weatherInfo.windSpeed} m/s',
          label: 'Wind'
        ),
      ],
    );
  }

  Widget _buildDetailItem({
    required IconData icon,
    required String value,
    required String label
  }) {
    return Column(
      children: [
        Icon(icon, size: 24),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildHourlyForecast(WeatherInfo weatherInfo) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Hourly Forecast',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 120,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: weatherInfo.hourlyForecast.length,
            itemBuilder: (context, index) {
              final hourForecast = weatherInfo.hourlyForecast[index];
              return Container(
                margin: const EdgeInsets.only(right: 16),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(hourForecast.time),
                    const SizedBox(height: 8),
                    Text(
                      hourForecast.weatherIcon,
                      style: const TextStyle(fontSize: 20),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '\${hourForecast.temperature.toStringAsFixed(0)}°',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDailyForecast(WeatherInfo weatherInfo) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '7-Day Forecast',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: weatherInfo.dailyForecast.length,
            separatorBuilder: (context, index) => Divider(
              height: 1,
              color: Colors.grey[300],
              indent: 16,
              endIndent: 16,
            ),
            itemBuilder: (context, index) {
              final day = weatherInfo.dailyForecast[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: Text(
                        day.day,
                        style: const TextStyle(fontWeight: FontWeight.w500),
                      ),
                    ),
                    Text(
                      day.weatherIcon,
                      style: const TextStyle(fontSize: 20),
                    ),
                    Expanded(
                      flex: 3,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Text(
                            '\${day.minTemp.toStringAsFixed(0)}°',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            width: 50,
                            height: 4,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(2),
                              gradient: LinearGradient(
                                colors: [
                                  Colors.blue[300]!,
                                  Colors.red[300]!,
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '\${day.maxTemp.toStringAsFixed(0)}°',
                            style: const TextStyle(fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
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
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.light,
    ),
    appBarTheme: const AppBarTheme(
      elevation: 0,
    ),
  );

  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.dark,
    ),
    appBarTheme: const AppBarTheme(
      elevation: 0,
    ),
  );
}`,
        language: "dart"
      }
    ],
    instructions: `# Flutter Weather App Implementation Guide

## Project Setup

1. Create a new Flutter project: \`flutter create weather_app\`
2. Replace the auto-generated files with the provided Dart files
3. Add dependencies to pubspec.yaml:

\`\`\`yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.0.3
  http: ^0.13.4
  location: ^4.4.0
\`\`\`

## File Structure

- **main.dart**: Entry point of the app
- **weather_model.dart**: Contains data models and state management
- **weather_service.dart**: Handles data fetching and location services
- **home_screen.dart**: Main UI of the application
- **theme.dart**: Custom theme definitions (not shown)

## Key Features

- Current weather display
- Hourly and 7-day forecast
- Location-based weather
- Search for weather by city
- Clean, responsive UI
- Dark/light theme support

## Implementation Notes

The current implementation uses mock data in the WeatherService class. In a production app, you should:

1. Register for an API key from a weather provider like OpenWeatherMap
2. Replace the mock implementation with actual API calls
3. Add caching for performance and offline support
4. Implement proper error handling

## Running the App

1. Install dependencies: \`flutter pub get\`
2. Run the app: \`flutter run\`

## Adding Real API Integration

To implement real weather API integration, update the WeatherService class and uncomment the _fetchRealWeatherData method, replacing the mock implementation.`
  }
};

// Component to render the result page
export default function Result() {
  const [selectedResponse, setSelectedResponse] = useState("kotlin-todo");
  const [activeTab, setActiveTab] = useState("files");
  const [editMode, setEditMode] = useState(false);
  const [editedInstructions, setEditedInstructions] = useState("");
  const [language, setLanguage] = useState("kotlin");
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's a response ID in the URL query params
    const params = new URLSearchParams(location.search);
    const responseId = params.get("id");
    
    if (responseId && mockResponses[responseId]) {
      setSelectedResponse(responseId);
      
      // Set language based on selected response
      if (responseId === "kotlin-todo") {
        setLanguage("kotlin");
      } else if (responseId === "swift-rss") {
        setLanguage("swift");
      } else if (responseId === "dart-weather") {
        setLanguage("dart");
      }
    }
    
    // Set initial instructions for editing
    if (mockResponses[selectedResponse]) {
      setEditedInstructions(mockResponses[selectedResponse].instructions);
    }
  }, [location.search]);
  
  useEffect(() => {
    // Update instructions when selected response changes
    if (mockResponses[selectedResponse]) {
      setEditedInstructions(mockResponses[selectedResponse].instructions);
    }
  }, [selectedResponse]);
  
  const handleGoBack = () => {
    navigate("/");
  };
  
  const currentResponse = mockResponses[selectedResponse] || mockResponses["kotlin-todo"];
  
  const handleCopyAll = () => {
    // Create a text representation of all files
    const allFilesContent = currentResponse.files
      .map(file => `// File: ${file.name}\n\n${file.content}`)
      .join("\n\n");
    
    navigator.clipboard.writeText(allFilesContent);
    toast("All files copied to clipboard");
  };
  
  const handleDownload = () => {
    // In a real app, this would create a zip file with all the code files
    toast("Download functionality would be implemented in a real app");
  };
  
  const toggleEditMode = () => {
    if (editMode) {
      // Save changes
      // In a real app, this would update the stored instructions
      toast("Changes saved");
    }
    setEditMode(!editMode);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle language={language} setLanguage={setLanguage} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Project Code</h2>
              
              <div className="bg-card border rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <select 
                    className="flex-1 bg-transparent text-sm font-medium" 
                    value={selectedResponse}
                    onChange={(e) => {
                      setSelectedResponse(e.target.value);
                      // Update language when response changes
                      const newSelection = e.target.value;
                      if (newSelection === "kotlin-todo") {
                        setLanguage("kotlin");
                      } else if (newSelection === "swift-rss") {
                        setLanguage("swift");
                      } else if (newSelection === "dart-weather") {
                        setLanguage("dart");
                      }
                    }}
                  >
                    <option value="kotlin-todo">Android - Todo App (Kotlin/Compose)</option>
                    <option value="swift-rss">iOS - RSS Reader (Swift/SwiftUI)</option>
                    <option value="dart-weather">Flutter - Weather App (Dart)</option>
                  </select>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={handleCopyAll}>
                    <Copy className="mr-1 h-4 w-4" />
                    Copy All
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <FileDown className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedResponse("kotlin-todo")}>
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                </TabsList>
                
                {activeTab === "instructions" && (
                  <Button size="sm" variant={editMode ? "default" : "outline"} onClick={toggleEditMode}>
                    {editMode ? (
                      <>
                        <Save className="mr-1 h-4 w-4" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              <TabsContent value="files" className="space-y-4">
                {currentResponse.files.map((file) => (
                  <CodeExample
                    key={file.name}
                    fileName={file.name}
                    language={file.language}
                    code={file.content}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="instructions">
                {editMode ? (
                  <Textarea
                    value={editedInstructions}
                    onChange={(e) => setEditedInstructions(e.target.value)}
                    className="min-h-[500px] font-mono text-sm"
                  />
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-card border rounded-lg">
                    <div dangerouslySetInnerHTML={{ 
                      __html: currentResponse.instructions.replace(/\n/g, '<br>') 
                    }} />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
