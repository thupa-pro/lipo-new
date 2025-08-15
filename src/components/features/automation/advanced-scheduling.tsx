"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, Users, MapPin, Video, Phone,
  Plus, Edit3, Trash2, Copy, Share2, Bell,
  ChevronLeft, ChevronRight, Filter, Search,
  Globe, Repeat, AlertCircle, CheckCircle,
  X, Settings, Download, Upload, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
  isBlocked?: boolean;
  reason?: string;
}

interface Appointment {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'meeting' | 'consultation' | 'service' | 'event' | 'break';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  attendees: Array<{
    id: string;
    name: string;
    email: string;
    role: 'organizer' | 'participant' | 'optional';
    status: 'pending' | 'accepted' | 'declined' | 'tentative';
  }>;
  location?: {
    type: 'in_person' | 'video' | 'phone';
    address?: string;
    videoUrl?: string;
    phoneNumber?: string;
  };
  reminders: Array<{
    time: number; // minutes before
    method: 'email' | 'sms' | 'push';
    sent: boolean;
  }>;
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    exceptions: Date[];
  };
  metadata: {
    serviceId?: string;
    clientId?: string;
    price?: number;
    currency?: string;
    notes?: string;
    attachments?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface SchedulingSettings {
  timeZone: string;
  workingHours: {
    [key: string]: {
      enabled: boolean;
      start: string;
      end: string;
      breaks: Array<{
        start: string;
        end: string;
        title: string;
      }>;
    };
  };
  appointmentTypes: Array<{
    id: string;
    name: string;
    duration: number;
    price?: number;
    color: string;
    requiresConfirmation: boolean;
    maxAdvanceBooking: number; // days
    minAdvanceBooking: number; // hours
    bufferTime: number; // minutes
  }>;
  notifications: {
    newAppointment: boolean;
    cancellation: boolean;
    reminder: boolean;
    confirmation: boolean;
  };
  integrations: {
    googleCalendar: boolean;
    outlookCalendar: boolean;
    zoom: boolean;
    teams: boolean;
  };
}

interface AdvancedSchedulingProps {
  appointments: Appointment[];
  settings: SchedulingSettings;
  onCreateAppointment?: (appointment: Partial<Appointment>) => void;
  onUpdateAppointment?: (id: string, updates: Partial<Appointment>) => void;
  onDeleteAppointment?: (id: string) => void;
  onUpdateSettings?: (settings: Partial<SchedulingSettings>) => void;
  className?: string;
}

export function AdvancedScheduling({
  appointments,
  settings,
  onCreateAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  onUpdateSettings,
  className = ""
}: AdvancedSchedulingProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return appointments.filter(apt => 
      apt.startTime.toDateString() === dateStr &&
      (statusFilter === 'all' || apt.status === statusFilter) &&
      (searchQuery === '' || 
       apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       apt.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'no_show': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'consultation': return <Calendar className="w-4 h-4" />;
      case 'service': return <Clock className="w-4 h-4" />;
      case 'event': return <Globe className="w-4 h-4" />;
      case 'break': return <X className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getLocationIcon = (locationType?: string) => {
    switch (locationType) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in_person': return <MapPin className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
    }
    return `${minutes}m`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border">
        {/* Header */}
        <div className="grid grid-cols-7 border-b">
          {dayNames.map(day => (
            <div key={day} className="p-4 text-center font-semibold border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const isCurrentMonth = day !== null;
            const isToday = day && day.toDateString() === new Date().toDateString();
            const dayAppointments = day ? getAppointmentsForDate(day) : [];

            return (
              <div
                key={index}
                className={`min-h-32 p-2 border-r border-b last:border-r-0 ${
                  !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800' : ''
                } ${isToday ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-2 ${
                      isToday ? 'text-blue-600' : ''
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map(apt => (
                        <div
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className="text-xs p-1 rounded cursor-pointer hover:opacity-80 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          <div className="font-medium truncate">{apt.title}</div>
                          <div>{formatTime(apt.startTime)}</div>
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayAppointments.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 border-r"></div>
          {weekDays.map(day => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div key={day.toISOString()} className={`p-4 text-center border-r last:border-r-0 ${
                isToday ? 'bg-blue-50 dark:bg-blue-950' : ''
              }`}>
                <div className="font-semibold">
                  {day.toLocaleDateString([], { weekday: 'short' })}
                </div>
                <div className={`text-2xl ${isToday ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Time Grid */}
        <div className="max-h-96 overflow-y-auto">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
              <div className="p-2 border-r text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              {weekDays.map(day => {
                const dayAppointments = getAppointmentsForDate(day).filter(apt => 
                  apt.startTime.getHours() === hour
                );
                
                return (
                  <div key={day.toISOString()} className="min-h-16 p-1 border-r last:border-r-0 relative">
                    {dayAppointments.map(apt => (
                      <div
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className="absolute inset-x-1 bg-blue-100 dark:bg-blue-900 rounded p-1 cursor-pointer hover:opacity-80 text-xs"
                        style={{
                          top: `${(apt.startTime.getMinutes() / 60) * 100}%`,
                          height: `${(formatDuration(apt.startTime, apt.endTime).includes('h') ? 
                            parseInt(formatDuration(apt.startTime, apt.endTime)) * 60 + 
                            (parseInt(formatDuration(apt.startTime, apt.endTime).split('h ')[1]) || 0) : 
                            parseInt(formatDuration(apt.startTime, apt.endTime))) / 60 * 100}%`
                        }}
                      >
                        <div className="font-medium truncate">{apt.title}</div>
                        <div>{formatTime(apt.startTime)} - {formatTime(apt.endTime)}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const upcomingAppointments = appointments
      .filter(apt => apt.startTime >= new Date())
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 20);

    return (
      <div className="space-y-4">
        {upcomingAppointments.map(apt => (
          <Card key={apt.id} className="glass-card cursor-pointer hover:shadow-md transition-shadow">
            <CardContent 
              className="pt-6"
              onClick={() => setSelectedAppointment(apt)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getTypeIcon(apt.type)}
                    <h4 className="font-semibold">{apt.title}</h4>
                    <Badge className={getStatusColor(apt.status)}>
                      {apt.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {apt.startTime.toLocaleDateString()} at {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                        </span>
                        <span>({formatDuration(apt.startTime, apt.endTime)})</span>
                      </div>
                      {apt.location && (
                        <div className="flex items-center space-x-1">
                          {getLocationIcon(apt.location.type)}
                          <span>
                            {apt.location.type === 'in_person' ? apt.location.address :
                             apt.location.type === 'video' ? 'Video Call' :
                             apt.location.type === 'phone' ? 'Phone Call' : 'Location TBD'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {apt.attendees.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{apt.attendees.length} attendees</span>
                      </div>
                    )}
                    
                    {apt.description && (
                      <p className="mt-2">{apt.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span>Advanced Scheduling</span>
          </h2>
          <p className="text-muted-foreground">
            Manage appointments, bookings, and calendar integrations
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowSettingsForm(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => setShowAppointmentForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-xl font-semibold">
                {view === 'month' ? currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' }) :
                 view === 'week' ? `Week of ${getWeekDays(currentDate)[0].toLocaleDateString()}` :
                 view === 'day' ? currentDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) :
                 'Upcoming Appointments'}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center border rounded-lg">
                {['month', 'week', 'day', 'agenda'].map((viewType) => (
                  <Button
                    key={viewType}
                    variant={view === viewType ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setView(viewType as any)}
                    className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                  >
                    {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Views */}
      <div>
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderWeekView()}
        {view === 'agenda' && renderAgendaView()}
      </div>

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAppointment(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">{selectedAppointment.title}</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedAppointment(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(selectedAppointment.status)}>
                        {selectedAppointment.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <div className="flex items-center space-x-1">
                        {getTypeIcon(selectedAppointment.type)}
                        <span className="capitalize">{selectedAppointment.type}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Time</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {selectedAppointment.startTime.toLocaleDateString()} at{' '}
                        {formatTime(selectedAppointment.startTime)} -{' '}
                        {formatTime(selectedAppointment.endTime)}
                      </span>
                      <span className="text-muted-foreground">
                        ({formatDuration(selectedAppointment.startTime, selectedAppointment.endTime)})
                      </span>
                    </div>
                  </div>

                  {selectedAppointment.location && (
                    <div>
                      <Label>Location</Label>
                      <div className="flex items-center space-x-1">
                        {getLocationIcon(selectedAppointment.location.type)}
                        <span>
                          {selectedAppointment.location.type === 'in_person' 
                            ? selectedAppointment.location.address
                            : selectedAppointment.location.type === 'video'
                            ? 'Video Call'
                            : 'Phone Call'
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Description</Label>
                    <p className="text-muted-foreground">
                      {selectedAppointment.description || 'No description provided.'}
                    </p>
                  </div>

                  {selectedAppointment.attendees.length > 0 && (
                    <div>
                      <Label>Attendees ({selectedAppointment.attendees.length})</Label>
                      <div className="space-y-2 mt-2">
                        {selectedAppointment.attendees.map((attendee) => (
                          <div key={attendee.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div>
                              <div className="font-medium">{attendee.name}</div>
                              <div className="text-sm text-muted-foreground">{attendee.email}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="capitalize">
                                {attendee.role}
                              </Badge>
                              <Badge className={
                                attendee.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                attendee.status === 'declined' ? 'bg-red-100 text-red-800' :
                                attendee.status === 'tentative' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {attendee.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
