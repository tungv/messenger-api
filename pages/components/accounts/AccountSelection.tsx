import Image from "next/image";

import avatar from "../assets/avatar.jpg";

const accounts = [
  {
    id: "1",
    name: "Will Smith",
  },
  {
    id: "2",
    name: "Jada",
  },
  {
    id: "3",
    name: "Jaden",
  },
  {
    id: "4",
    name: "Chris Rock",
  },
];

const Accounts = ({ goConversations }: { goConversations: (accountId: string) => void }) => {
  return (
    <>
      <style jsx>{`
        .account-selection {
          min-height: 100vh;
          display: grid;
          place-items: center;
        }

        .account {
          border-radius: 8px;
          min-width: 250px;
          display: flex;
          padding: 16px;
          cursor: pointer;
          margin-bottom: 16px;

          transition: 0.5s ease-in-out;
          color: rgba(255, 255, 255, 0.75);
          box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),
            0 5px 12px 4px rgba(0, 0, 0, 0.09);
        }

        .account:hover {
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
          padding-left: 16px;
        }

        .info div {
          margin-bottom: 4px;
        }
      `}</style>
      <div className="account-selection">
        <div>
          <h3 style={{ textAlign: "center" }}>Select an Account</h3>
          {accounts.map((account) => (
            <div key={account.id} className="account" onClick={() => goConversations(account.id)}>
              <div className="avatar-container">
                <Image
                  className="avatar"
                  src={`https://robohash.org/${account.name}`}
                  alt="Account 1"
                  width={40}
                  height={40}
                  objectFit="cover"
                />
              </div>
              <div className="info">
                <div>
                  <strong>{account.name}</strong>
                </div>
                <code>
                  {account.name.split(" ").join(".").toLowerCase()}@{account.name.split(" ").join(".").toLowerCase()}
                  .com
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Accounts;
