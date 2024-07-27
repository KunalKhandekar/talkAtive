import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({
      selectedConversation,
    }),
  messages: [],
  setMessages: (messages) =>
    set({
      messages,
    }),
  typingUsers: {},
  setTypingUser: (userId, isTyping) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [userId]: isTyping,
      },
    })),
  removeTypingUser: (userId) =>
    set((state) => {
      const { [userId]: _, ...rest } = state.typingUsers;
      return { typingUsers: rest };
    }),
}));

export default useConversation;
