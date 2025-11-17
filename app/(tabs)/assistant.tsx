import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Send, Bot, Loader } from "lucide-react-native";
import { useRorkAgent, createRorkTool } from "@rork-ai/toolkit-sdk";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState<string>("");

  const { messages, sendMessage } = useRorkAgent({
    tools: {
      getTripInfo: createRorkTool({
        description: "Get information about upcoming trips",
        zodSchema: z.object({
          query: z.string().describe("Query about trips"),
        }),
        execute(input) {
          return {
            nextTrip: "Tomorrow at 9:00 AM from Home",
            driver: "Raj Kumar",
            vehicle: "DL 1C 1234",
          };
        },
      }),
      getScheduleInfo: createRorkTool({
        description: "Get weekly schedule information",
        zodSchema: z.object({
          week: z.string().describe("Week to query").optional(),
        }),
        execute() {
          return {
            totalTrips: 10,
            approved: 8,
            pending: 2,
          };
        },
      }),
    },
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    await sendMessage(userMessage);
  };

  const suggestedQueries = [
    "What time is my cab tomorrow?",
    "Show my weekly schedule",
    "How many trips this week?",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Bot size={24} color={Colors.light.primary} />
          </View>
          <View>
            <Text style={styles.title}>AI Assistant</Text>
            <Text style={styles.subtitle}>Ask about your trips & schedule</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Bot size={48} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>Hello! How can I help?</Text>
            <Text style={styles.emptySubtitle}>
              Ask me anything about your cab schedule, trips, or bookings
            </Text>

            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Try asking:</Text>
              {suggestedQueries.map((query, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => {
                    setInput(query);
                  }}
                >
                  <Text style={styles.suggestionText}>{query}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <>
            {messages.map((m) => (
              <View key={m.id} style={styles.messageGroup}>
                {m.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <View
                        key={`${m.id}-${i}`}
                        style={[
                          styles.messageBubble,
                          m.role === "user"
                            ? styles.userMessage
                            : styles.assistantMessage,
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            m.role === "user"
                              ? styles.userMessageText
                              : styles.assistantMessageText,
                          ]}
                        >
                          {part.text}
                        </Text>
                      </View>
                    );
                  }

                  if (part.type === "tool") {
                    if (
                      part.state === "input-streaming" ||
                      part.state === "input-available"
                    ) {
                      return (
                        <View key={`${m.id}-${i}`} style={styles.toolMessage}>
                          <ActivityIndicator
                            size="small"
                            color={Colors.light.primary}
                          />
                          <Text style={styles.toolText}>
                            Fetching {part.toolName}...
                          </Text>
                        </View>
                      );
                    }
                  }

                  return null;
                })}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <View
        style={[styles.inputContainer, { paddingBottom: insets.bottom || 16 }]}
      >
        <TextInput
          style={styles.input}
          placeholder="Ask me anything..."
          placeholderTextColor={Colors.light.placeholder}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !input.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 24,
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 48,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  suggestionsContainer: {
    width: "100%",
    gap: 8,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  suggestionChip: {
    backgroundColor: Colors.light.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.light.primary,
  },
  messageGroup: {
    gap: 8,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.light.primary,
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  assistantMessageText: {
    color: Colors.light.text,
  },
  toolMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.light.info + "10",
    borderRadius: 12,
  },
  toolText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
    backgroundColor: Colors.light.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.inputBackground,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.light.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
