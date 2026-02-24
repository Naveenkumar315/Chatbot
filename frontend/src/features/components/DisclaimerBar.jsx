import files from "../../file";
import { Tooltip } from "antd";
import { useSettingsStore } from "../chat/store/settings.store";

const DisclaimerBar = () => {
    const theme = useSettingsStore((s) => s.theme)
    return (
        <div className={`w-full flex justify-center py-3 px-4  ${theme === "light" ? " border-t border-gray-200" : "bg-bg-dark-header"}`}>

            <div className="w-full flex items-center justify-between text-xs">

                {/* Left */}
                <div className="flex items-center gap-2 text-primary italic font-semibold">
                    <span>Disclaimer :</span>
                    <Tooltip
                        placement="rightTop"
                        styles={{ root: { maxWidth: 300 } }}

                        title="Please refer to the latest official documents or contact the appropriate department for confirmation. The chatbot and its creators are not responsible for any decisions made based on its responses."
                    >
                        <img
                            src={files.Info}
                            alt="info"
                            className="h-4 w-4 cursor-pointer"
                        />
                    </Tooltip>

                </div>

                {/* Right */}
                <div className="flex items-center gap-2 text-muted ">
                    <span className={`text-[#969696]`}>Powered by</span>
                    <img
                        src={theme === "dark" ? files.logo_dark_loan : files.logo_light_loan}
                        alt="LoanDNA"
                        className={`object-contain ${theme === "dark" ? " w-16" : " w-15"}`}
                    />
                </div>

            </div>

        </div>
    );
};

export default DisclaimerBar;