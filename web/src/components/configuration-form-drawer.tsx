import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ConfigurationForm } from "@/components/configuration-form";

interface ConfigurationFormDrawerProps {
  children: React.ReactNode;
}

export function ConfigurationFormDrawer({
  children,
}: ConfigurationFormDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col h-[70vh]">
          <div className="flex-grow overflow-y-auto">
            <ConfigurationForm />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
