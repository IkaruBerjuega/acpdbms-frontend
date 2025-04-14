"use client";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../card";
import NotificationsToggle from "./account-settings/notifications";
import AccountSecurity from "./account-settings/account-security";
import ProfileSettings from "./account-settings/profile";

export default function AccountSettings({
  activeTab,
  role,
}: {
  activeTab: "profile" | "security" | "notification";
  role: "client" | "employee";
}) {
  const { push } = useRouter();
  const tabs = [
    { value: "profile", label: "Profile Settings" },
    { value: "security", label: "Account Security" },
    { value: "notification", label: "Notification Settings" },
  ];
  const handleTabChange = (value: string) => {
    push(`/${role}/settings?tab=${value}`);
  };
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="profile">
            <ProfileSettings role={role} />
          </TabsContent>
          <TabsContent value="security">
            <AccountSecurity />
          </TabsContent>
          <TabsContent value="notification">
            <NotificationsToggle />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
