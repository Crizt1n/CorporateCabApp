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

interface TripData {
  id: string;
  date: string;
  time: string;
  pickupLocation: string;
  dropLocation: string;
  driver: string;
  vehicle: string;
  status: string;
}

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useAuth();

  // Mock trip data
  const upcomingTrips: TripData[] = [
    {
      id: "1",
      date: "Tomorrow",
      time: "9:00 AM",
      pickupLocation: "123 Home Street, Delhi",
      dropLocation: "Tech Park, Gurgaon",
      driver: "Raj Kumar",
      vehicle: "DL 1C AB 1234",
      status: "scheduled",
    },
    {
      id: "2",
      date: "Dec 25",
      time: "5:00 PM",
      pickupLocation: "Tech Park, Gurgaon",
      dropLocation: "123 Home Street, Delhi",
      driver: "Priya Singh",
      vehicle: "DL 1C CD 5678",
      status: "scheduled",
    },
  ];

  const { messages, sendMessage } = useRorkAgent({
    tools: {
      getTripInfo: createRorkTool({
        description:
          "Get detailed information about upcoming trips and schedules",
        zodSchema: z.object({
          timeframe: z
            .string()
            .describe("Timeframe like 'tomorrow', 'next week', 'today'"),
        }),
        execute(input) {
          const relevantTrips = upcomingTrips.filter((trip) => {
            const lower = input.timeframe.toLowerCase();
            if (lower.includes("tomorrow")) return trip.date === "Tomorrow";
            if (lower.includes("next") || lower.includes("week"))
              return true;
            if (lower.includes("today")) return trip.date === "Today";
            return true;
          });

          return {
            trips: relevantTrips,
            total: relevantTrips.length,
            summary:
              relevantTrips.length > 0
                ? `You have ${relevantTrips.length} trip(s) ${input.timeframe}. First trip: ${relevantTrips[0].time} from ${relevantTrips[0].pickupLocation}`
                : `No trips found for ${input.timeframe}`,
          };
        },
      }),
      getScheduleStatus: createRorkTool({
        description:
          "Get your weekly schedule status including approved and pending requests",
        zodSchema: z.object({
          week: z.string().describe("Week to query").optional(),
        }),
        execute() {
          return {
            totalSlots: 10,
            approved: 8,
            pending: 2,
            rejected: 0,
            submissionDeadline: "Friday 5:00 PM",
            message:
              "You have 8 approved slots and 2 pending slots for the week. Submit changes by Friday 5:00 PM.",
          };
        },
      }),
      getCompletedTrips: createRorkTool({
        description: "Get information about completed trips and statistics",
        zodSchema: z.object({
          timeframe: z.string().describe("Timeframe like 'this week', 'month'"),
        }),
        execute() {
          return {
            completedThisWeek: 6,
            averageRating: 4.8,
            totalTripsCompleted: 45,
            message:
              "Great job! You completed 6 trips this week with an average rating of 4.8/5.",
          };
        },
      }),
      requestScheduleChange: createRorkTool({
        description: "Request a change to your schedule",
        zodSchema: z.object({
          date: z.string().describe("Date of the change"),
          type: z.enum(["address", "time"]).describe("Type of change"),
          oldValue: z.string().describe("Current value"),
          newValue: z.string().describe("Desired value"),
        }),
        execute(input) {
          return {
            success: true,
            requestId: `CHG-${Date.now()}`,
            message: `Your request to change ${input.type} on ${input.date} has been submitted for approval.`,
          };
        },
      }),
    },
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setIsLoading(true);

    try {
      await sendMessage(userMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
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
                            {part.toolName
                              .replace(/([A-Z])/g, " $1")
                              .toLowerCase()}
                            ...
                          </Text>
                        </View>
                      );
                    }

                    if (part.state === "result") {
                      return (
                        <View key={`${m.id}-${i}`} style={styles.toolResult}>
                          <Text style={styles.toolResultTitle}>
                            {part.toolName
                              .replace(/([A-Z])/g, " $1")
                              .toLowerCase()
                              .trim()}
                          </Text>
                          {typeof part.result === "object" && (
                            <Text style={styles.toolResultText}>
                              {JSON.stringify(part.result, null, 2)}
                            </Text>
                          )}
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
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    gap: 10,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 7,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: "center",
    paddingHorizontal: 28,
    marginBottom: 28,
  },
  suggestionsContainer: {
    width: "100%",
    gap: 7,
  },
  suggestionsTitle: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginBottom: 3,
  },
  suggestionChip: {
    backgroundColor: Colors.light.cardBackground,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  suggestionText: {
    fontSize: 13,
    color: Colors.light.primary,
  },
  messageGroup: {
    gap: 7,
  },
  messageBubble: {
    maxWidth: "82%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 15,
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
    fontSize: 13,
    lineHeight: 19,
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
    gap: 7,
    alignSelf: "flex-start",
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: Colors.light.info + "10",
    borderRadius: 11,
  },
  toolText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  toolResult: {
    alignSelf: "flex-start",
    maxWidth: "85%",
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.success,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 3,
  },
  toolResultTitle: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: Colors.light.success,
    textTransform: "uppercase" as const,
  },
  toolResultText: {
    fontSize: 11,
    color: Colors.light.text,
    lineHeight: 15,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 10,
    backgroundColor: Colors.light.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.inputBackground,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: Colors.light.text,
    maxHeight: 95,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
