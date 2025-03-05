import SidepanelDrawerComponent from "../../general/sidepanel-drawer";
import AddClient from "./sidepanel-contents.tsx/add-client";
import AddEmployee from "./sidepanel-contents.tsx/add-employee";
import GrantAccess from "./sidepanel-contents.tsx/grant-access";

interface SidepanelProps {
  activeKey: "add" | "grant_access";
  isEmployee: boolean;
  isOpen: boolean;
}

interface ConfigProps {
  title: string;
  content: JSX.Element;
  desc: string;
}

export default function Sidepanel({
  activeKey,
  isEmployee,
  isOpen,
}: SidepanelProps) {
  const config: Record<string, ConfigProps> = {
    add: {
      title: isEmployee ? "Add Employee" : "Add Client",
      content: isEmployee ? (
        <AddEmployee isOpen={isOpen} />
      ) : (
        <AddClient isOpen={isOpen} />
      ),
      desc: isEmployee
        ? "Create a new Employee Account"
        : "Create a new Client Account",
    },
    grant_access: {
      title: "Grant Project Access",
      content: <GrantAccess isOpen={isOpen} />,
      desc: "Grant Project Access to Employees",
    },
  };

  const content = config[activeKey].content;
  const title = config[activeKey].title;
  const desc = config[activeKey].desc;

  return (
    <SidepanelDrawerComponent
      paramKey={activeKey}
      content={content}
      title={title}
      description={desc}
    />
  );
}
