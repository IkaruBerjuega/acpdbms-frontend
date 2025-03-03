import SidepanelDrawerComponent from "../../general/drawer";

function AddEmployee({ isOpen }: { isOpen: boolean }) {
  return <div></div>;
}

function GrantAccess({ isOpen }: { isOpen: boolean }) {
  return <div></div>;
}

function AddClient({ isOpen }: { isOpen: boolean }) {
  return <div></div>;
}

interface SidepanelProps {
  activeKey: string;
  isEmployee: boolean;
  isOpen: boolean;
}

export default function Sidepanel({
  activeKey,
  isEmployee,
  isOpen,
}: SidepanelProps) {
  const map = {
    add: {
      content: isEmployee ? (
        <AddEmployee isOpen={isOpen} />
      ) : (
        <AddClient isOpen={isOpen} />
      ),
    },
    grant_access: {
      content: <GrantAccess isOpen={isOpen} />,
    },
  };

  return (
    <SidepanelDrawerComponent
      paramKey={activeKey}
      content={<></>}
      title={""}
      description={""}
    />
  );
}
