import Image from "next/image";
import { Message } from "types/api";

const formatDate = (createdAt: string) => {
  const timestamp = parseInt(createdAt);
  return new Date(timestamp).toUTCString();
};

const OwnerMessage = ({ message: { text, sender, createdAt } }: { message: Message }) => {
  return (
    <>
      <style jsx>
        {`
          .owner-message-wrapper {
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
            align-self: end;
          }

          .owner-send-date {
            color: rgba(255, 255, 255, 0.65);
            font-size: 0.75rem;
            text-align: right;
            margin-bottom: 4px;
          }

          .owner-message-container {
            margin-bottom: 8px;
            display: flex;
            justify-content: flex-end;
          }

          .owner-message {
            border-radius: 8px;
            min-width: 250px;
            padding: 8px;
            color: rgba(255, 255, 255, 0.85);
            background-color: #096dd9;
            display: inline-block;
            min-width: fit-content;
            max-width: 40%;
          }

          .owner-avatar {
            display: grid;
            place-items: center;
            overflow: hidden;
            max-width: 70px;
            margin-left: 8px;
            height: 30px;
            width: 30px;
            border-radius: 100px;
            border: 1px solid #096dd9;
          }
        `}
      </style>
      <div className="owner-message-wrapper">
        <div className="owner-send-date">{formatDate(createdAt)}</div>
        <div className="owner-message-container">
          <div className="owner-message">{text}</div>
          <div className="owner-avatar">
            <Image
              src={`https://robohash.org/${sender.name}`}
              alt="Account 2"
              width={30}
              height={30}
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerMessage;
