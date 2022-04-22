import Image from "next/image";
import { useEffect, useState } from "react";
import { Conversation, Message } from "types/api";
import { useConversations, useMessages } from "../../../utils/hooks";
import OwnerMessage from "./OwnerMessage";
import PartnerMessage from "./PartnerMessage";

const formatDate = (createdAt: string) => {
  const timestamp = parseInt(createdAt);
  return new Date(timestamp).toDateString();
};

const Conversation = ({ goAccountSelection, accountId }: { accountId: string; goAccountSelection: () => void }) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const conversations = useConversations({ accountId });
  const messages = useMessages({ accountId, conversationId: selectedConversation?.id });

  useEffect(() => {
    if (conversations) {
      setSelectedConversation(conversations.rows[0]);
    }
  }, [conversations]);

  return (
    <>
      <style jsx>
        {`
          .conversations {
            display: grid;
            grid-template-columns: minmax(250px, 15%) 1fr;
            height: 100vh;
            overflow: hidden;
          }

          .sidebar {
            padding: 16px;
            border-right: 1px solid rgba(255, 255, 255, 0.16);
            background-color: #353535;
            z-index: 10;
          }

          .conversation-item {
            border-radius: 8px;
            min-width: 80px;
            max-width: 100%;
            display: flex;
            padding: 8px;
            cursor: pointer;
            margin-bottom: 16px;

            transition: 0.5s ease-in-out;
            color: rgba(255, 255, 255, 0.75);
            box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),
              0 5px 12px 4px rgba(0, 0, 0, 0.09);
          }

          .active {
            background-color: #505050;
          }

          .conversation-item:hover {
            color: rgba(255, 255, 255, 1);
            box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.32), 0 9px 28px 0 rgba(0, 0, 0, 0.2),
              0 12px 48px 16px rgba(0, 0, 0, 0.12);
          }

          .avatar-container {
            width: 50px;
            display: grid;
            place-items: center;
          }

          .info {
            padding-left: 4px;
          }

          .name {
            margin-bottom: 4px;
          }

          .conversation {
            display: grid;
            grid-template-rows: auto 1fr auto;
          }

          .conversation-meta {
            border-bottom: 1px solid rgba(255, 255, 255, 0.16);
            padding: 1rem;
          }

          .conversation-container {
            border-bottom: 1px solid rgba(255, 255, 255, 0.16);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }

          .conversation-toolbar {
            height: auto;
            display: flex;
          }

          .conversation-input {
            flex: 1;
            padding: 1rem;
            background-color: transparent;
            color: rgba(255, 255, 255, 0.75);
            border: none;
            background-color: #303030;
            transition: 0.5s ease-in-out;
            width: 100%;
          }

          .conversation-input:focus {
            outline: none;
            background-color: #353535;
          }

          .send-message {
            right: 4px;
            top: 10px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.75);
            cursor: pointer;
          }
        `}
      </style>
      <div className="conversations">
        <div className="sidebar">
          <div style={{ cursor: "pointer" }} onClick={goAccountSelection}>
            Back
          </div>
          <div style={{ marginTop: 16 }}>
            {conversations &&
              conversations.rows.map((conversation) => (
                <div
                  className={
                    conversation.id === selectedConversation?.id ? "conversation-item active" : "conversation-item"
                  }
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="avatar-container">
                    <Image
                      className="avatar"
                      src={`https://robohash.org/${conversation.participants[1].name}`}
                      alt="Account 1"
                      width={40}
                      height={40}
                      objectFit="cover"
                    />
                  </div>
                  <div className="info">
                    <div className="name">
                      <strong>{conversation.participants[1].name}</strong>
                    </div>
                    {conversation.lastMessage && (
                      <>
                        <div>
                          {conversation.lastMessage.text.length > 12
                            ? `${conversation.lastMessage.text.substring(0, 12)}...`
                            : conversation.lastMessage.text}
                        </div>
                        <small style={{ textAlign: "right" }}>{formatDate(conversation.lastMessage.createdAt)}</small>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="conversation">
          <div className="conversation-meta">
            <Image
              className="avatar"
              src={`https://robohash.org/${selectedConversation?.participants[0].name}`}
              alt="Account 1"
              width={40}
              height={40}
              objectFit="cover"
            />
            <Image
              className="avatar"
              src={`https://robohash.org/${selectedConversation?.participants[1].name}`}
              alt="Account 1"
              width={40}
              height={40}
              objectFit="cover"
            />
            Talking with {selectedConversation?.participants[1].name}
          </div>
          <div className="conversation-container">
            {messages &&
              messages.rows.map((message: Message) =>
                message.sender.id === accountId ? (
                  <OwnerMessage key={message.id} message={message} />
                ) : (
                  <PartnerMessage key={message.id} message={message} />
                )
              )}
          </div>
          <div className="conversation-toolbar">
            <input type="text" className="conversation-input" />
            <button className="send-message">Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversation;
