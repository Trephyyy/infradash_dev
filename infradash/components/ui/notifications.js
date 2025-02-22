'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationBox() {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState({
    title: "New Notification",
    description: "This is a modern notification box.",
    severity: "info", // Options: info, warning, error
  });

  return (
    <div className="fixed top-5 right-5 z-50">
      <Button
        onClick={() => setIsVisible(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        <Bell className="w-5 h-5" />
        Show Notification
      </Button>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative mt-4"
        >
          <Card className={`bg-white shadow-xl rounded-2xl w-80 p-4 border-l-4 ${
            notification.severity === "info" ? "border-blue-500" :
            notification.severity === "warning" ? "border-yellow-500" :
            "border-red-500"
          }`}>
            <CardContent className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">{notification.title}</h4>
                <p className="text-gray-600 text-sm">{notification.description}</p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
