import MessageInput from "@/components/global/message-input/message-input";
import MessageInputWrapper from "@/components/global/message-input/message-input-wrapper";
import LeftHeader from "@/components/left-bar/left-header";
import SingleChatCard from "@/components/left-bar/single-chat-card";
import RightHeader from "@/components/right-bar/right-header";

const page = () => {
  return (
    <div className="h-screen  flex w-full">
      <div className="w-[25%] flex flex-col bg-sidebar">
        <LeftHeader />
        <div className="flex-1 overflow-auto mt-4">
          <SingleChatCard />
          <SingleChatCard />
          <SingleChatCard />
          <SingleChatCard />
        </div>
      </div>

      <div className="w-[75%] flex flex-col bg-background relative">
        <RightHeader />
        <div className="flex-1 overflow-auto">
          <h1>Right</h1>
        </div>

        <div className="absolute bottom-0 left-0 repeat-0 w-full bg-secondary">
          <MessageInputWrapper>
            <MessageInput />
          </MessageInputWrapper>
        </div>
      </div>
    </div>
  );
};

export default page;
