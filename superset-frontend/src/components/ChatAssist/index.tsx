/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { useState } from 'react';
import { styled, css, useTheme, SupersetTheme } from '@superset-ui/core';
import { BootstrapUser } from 'src/types/bootstrapTypes';
import { Icons } from '@superset-ui/core/components/Icons';

interface ChatAssistProps {
  user?: BootstrapUser;
}

const ChatButton = styled.button`
  ${({ theme }: { theme: SupersetTheme }) => css`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: ${theme.colorPrimary};
    color: ${theme.colorTextLightSolid};
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    z-index: ${theme.zIndexPopupBase + 100};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.05);
      background-color: ${theme.colorPrimaryHover};
    }
  `}
`;

const ChatContainer = styled.div<{ isOpen: boolean }>`
  ${({ theme, isOpen }: { theme: SupersetTheme; isOpen: boolean }) => css`
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 400px;
    height: 600px;
    background-color: ${theme.colorTextLightSolid}; // Using white/light color
    border-radius: ${theme.borderRadius}px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: ${theme.zIndexPopupBase + 100};
    overflow: hidden;
    display: ${isOpen ? 'block' : 'none'};
    border: 1px solid #d9d9d9; // Fallback for border color
  `}
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export default function ChatAssist({ user }: ChatAssistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  // Only show for authenticated users (must have userId)
  if (!user?.userId) {
    return null;
  }

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ChatContainer isOpen={isOpen}>
        <Iframe
          src={`/chat/widget${user ? `?userId=${user.userId}&username=${encodeURIComponent(user.firstName + ' ' + user.lastName)}` : ''}`}
          title="Superset AI Assistant"
        />
      </ChatContainer>
      <ChatButton onClick={toggleChat} aria-label="Toggle Chat Assistant">
        {isOpen ? (
          <Icons.CloseOutlined iconColor={theme.colorTextLightSolid} iconSize="xxl" />
        ) : (
          <Icons.CommentOutlined iconColor={theme.colorTextLightSolid} iconSize="xxl" />
        )}
      </ChatButton>
    </>
  );
}
