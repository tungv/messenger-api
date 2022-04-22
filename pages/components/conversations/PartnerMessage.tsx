import Image from "next/image";

const formatDate = (createdAt: string) => {
  const timestamp = parseInt(createdAt);
  return new Date(timestamp).toUTCString();
};

const PartnerMessage = ({
  message,
  sender,
  createdAt,
}: {
  message: string;
  sender: { name: string };
  createdAt: string;
}) => {
  return (
    <>
      <style jsx>
        {`
          .partner-message-container {
            margin-bottom: 8px;
            display: flex;
            justify-content: flex-start;
          }

          .partner-message {
            border-radius: 8px;
            min-width: 250px;
            padding: 8px;
            color: rgba(255, 255, 255, 0.85);
            display: inline-block;
            min-width: fit-content;
            max-width: 40%;
            background-color: #8c8c8c;
          }

          .partner-avatar {
            display: grid;
            place-items: center;
            overflow: hidden;
            max-width: 70px;
            margin-right: 8px;
            height: 30px;
            width: 30px;
            border-radius: 100px;
            border: 1px solid #8c8c8c;
          }

          .partner-send-date {
            color: rgba(255, 255, 255, 0.65);
            font-size: 0.75rem;
            margin-bottom: 4px;
          }
        `}
      </style>
      <div>
        <div className="partner-send-date">{formatDate(createdAt)}</div>
        <div className="partner-message-container">
          <div className="partner-avatar">
            <Image
              src={`https://robohash.org/${sender.name}`}
              alt="Account 2"
              width={30}
              height={30}
              objectFit="cover"
            />
          </div>
          <div className="partner-message">{message}</div>
        </div>
      </div>
    </>
  );
};

export default PartnerMessage;
