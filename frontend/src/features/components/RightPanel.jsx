import SourcePanel from "./SourcePanel";
import PDFPanel from "./PDFPanel";
import { useUIStore } from "../chat/store/ui.store";

const RightPanel = () => {
    const { panel } = useUIStore();

    return (
        <div className="flex flex-col h-full w-full max-w-full bg-bg-gray overflow-hidden">
            {panel === "source" && <SourcePanel />}
            {panel === "pdf" && <PDFPanel />}
        </div>
    );
};

export default RightPanel;