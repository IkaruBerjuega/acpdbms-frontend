"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ContactSettings } from "./contact-settings";
import { AdminTools } from "./admin-tools";

export default function AdminSettings({
  activeTab,
}: {
  activeTab: "tools" | "contacts";
}) {
  const { push } = useRouter();

  const tabs = [
    { value: "contacts", label: "Contact Details" },
    { value: "tools", label: "Admin Tools" },
  ];

  const handleTabChange = (value: string) => {
    push(`/admin/settings?tab=${value}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your site settings and configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="contacts">
            <ContactSettings />
          </TabsContent>
          <TabsContent value="tools">
            <AdminTools />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
