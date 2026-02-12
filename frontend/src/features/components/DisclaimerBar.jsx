import files from "../../file";
import { Tooltip } from "antd";

const DisclaimerBar = () => {
    return (
        <div className="w-full flex justify-center mt-3">

            <div className="w-full max-w-[750px] flex items-center justify-between text-xs">

                {/* Left */}
                <div className="flex items-center gap-2 text-primary italic font-semibold">
                    <span>Disclaimer :</span>
                    <Tooltip
                        placement="rightTop"
                        styles={{
                            root: {
                                maxWidth: "600px",
                            },
                        }}
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
                <div className="flex items-center gap-2 text-muted">
                    <span>Powered by</span>
                    <img
                        src={files.loandna}
                        alt="LoanDNA"
                        className="h-4 object-contain"
                    />
                </div>

            </div>

        </div>
    );
};

export default DisclaimerBar;
