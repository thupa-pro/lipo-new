"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Circle,
  Star,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react";
import { RealtimeChat } from "@/components/messages/realtime-chat";
import { useSocket } from "@/hooks/use-socket";
import { createClient } from "@/lib/supabase/client";

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { isConnected, error } = useSocket();

  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);
  const conversations = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "House Cleaner",
      lastMessage: "I'll be there at 2 PM tomorrow",
      time: "2m ago",
      unread: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      role: "Plumber",
      lastMessage: "The job is completed. Everything looks good!",
      time: "1h ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Personal Trainer",
      lastMessage: "See you for our session on Friday",
      time: "3h ago",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      rating: 5.0,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "Hi! I'm confirming our cleaning appointment for tomorrow.",
      time: "10:30 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      content: "Perfect! What time will you arrive?",
      time: "10:32 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "Sarah Chen",
      content:
        "I'll be there at 2 PM tomorrow. I'll bring all my cleaning supplies.",
      time: "10:35 AM",
      isMe: false,
    },
    {
      id: 4,
      sender: "Me",
      content: "Great! I'll make sure someone is home to let you in.",
      time: "10:40 AM",
      isMe: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Messages
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Chat with your service providers and customers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1 border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Conversations
                </CardTitle>
                <Badge variant="secondary">{conversations.length}</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Connection Status */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-red-500" />
                    <span>Connecting...</span>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-l-4 ${
                      selectedConversation?.id === conversation.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-transparent hover:border-blue-500"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={conversation.avatar}
                          alt={conversation.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                          {conversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          conversation.status === "online"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-slate-500">
                            {conversation.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-blue-600 mb-1">
                        {conversation.role}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {conversation.time}
                        </span>
                        {conversation.unread > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation && currentUser ? (
              <RealtimeChat
                conversationId={`conv-${selectedConversation.id}`}
                currentUserId={currentUser.id}
                recipient={{
                  id: `user-${selectedConversation.id}`,
                  display_name: selectedConversation.name,
                  avatar_url: selectedConversation.avatar,
                }}
                className="border-0 shadow-sm"
              />
            ) : (
              <Card className="border-0 shadow-sm h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start chatting
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
