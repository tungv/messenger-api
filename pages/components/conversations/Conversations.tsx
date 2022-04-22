import { useConversations, useMessages } from "../../../utils/hooks";
import OwnerMessage from "./OwnerMessage";
import PartnerMessage from "./PartnerMessage";

const Conversation = ({ goAccountSelection, accountId }: { accountId: string; goAccountSelection: () => void }) => {
  const conversations = useConversations({ accountId });
  const messages = useMessages({ accountId, conversationId: "1" });

  return (
    <>
      <style jsx>
        {`
          .conversations {
            display: grid;
            grid-template-columns: minmax(150px, 15%) 1fr;
            height: 100vh;
            overflow: hidden;
          }

          .sidebar {
            padding-top: 16px;
            padding-left: 16px;
            border-right: 1px solid rgba(255, 255, 255, 0.16);
            background-color: #353535;
            z-index: 10;
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
          }

          .conversation-input {
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
        `}
      </style>
      <div className="conversations">
        <div className="sidebar">
          <div style={{ cursor: "pointer" }} onClick={goAccountSelection}>
            Back
          </div>
          {conversations &&
            conversations.rows.map(({ id, participantIds }) => <div key={id}>{JSON.stringify(participantIds)}</div>)}
        </div>
        <div className="conversation">
          <div className="conversation-meta">Talking with Jada</div>
          <div className="conversation-container">
            {messages &&
              messages.rows.map(({ id, sender, text, createdAt }) =>
                sender.id === accountId ? (
                  <OwnerMessage key={id} sender={sender} message={text} createdAt={createdAt} />
                ) : (
                  <PartnerMessage key={id} sender={sender} message={text} createdAt={createdAt} />
                )
              )}
          </div>
          <div className="conversation-toolbar">
            <input type="text" className="conversation-input" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversation;
