import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface TeamInviteEmailProps {
  invitedByUsername: string;
  teamName: string;
  inviteLink: string;
}

export const TeamInviteEmail = ({
  invitedByUsername,
  teamName,
  inviteLink,
}: TeamInviteEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        {invitedByUsername} invited you to the {teamName} team
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>🎵 Ritmus</Heading>
          <Section style={body}>
            <Text style={paragraph}>Hello,</Text>
            <Text style={paragraph}>
              <strong>{invitedByUsername}</strong> has invited you to
              collaborate in the <strong>{teamName}</strong> team.
            </Text>
            <Text style={paragraph}>
              Click the button below to accept the invitation and join the team.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={inviteLink}>
                Accept Invitation
              </Button>
            </Section>
            <Text style={paragraph}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={link}>{inviteLink}</Text>
            <Hr style={hr} />
            <Text style={footer}>
              Didn&apos;t expect this invitation? You can safely ignore it.
            </Text>
            <Text style={footer}>This invitation will expire in 7 days.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TeamInviteEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "64px",
  borderRadius: "12px",
  maxWidth: "480px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#000",
  textAlign: "center" as const,
  margin: "0 0 30px",
};

const body = {
  padding: "0 12px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
};

const link = {
  fontSize: "14px",
  color: "#666",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "30px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
