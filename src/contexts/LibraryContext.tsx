import React, { createContext, useContext, useState, useCallback } from "react";
import { BookRequest, RequestStatus } from "@/types";
import { getBooks } from "@/data/mockData";

interface LibraryState {
  requests: BookRequest[];
  message: string | null;
  clearMessage: () => void;
  addRequest: (req: BookRequest) => void;
  updateRequestStatus: (
    requestId: string,
    status: RequestStatus,
    dueDate?: string
  ) => void;
  returnBook: (requestId: string) => void;
  getStudentRequests: (studentId: string) => BookRequest[];
  getStudentBorrowedBooks: (studentId: string) => BookRequest[];
  getPendingRequests: () => BookRequest[];
  getAllIssuedBooks: () => BookRequest[];
}

const LibraryContext = createContext<LibraryState | null>(null);

/* -------- INITIAL DATA -------- */

function generateInitialRequests(): BookRequest[] {
  const books = getBooks();

  return [
    {
      id: "req-001",
      bookId: books[0].id,
      bookTitle: books[0].title,
      studentId: "y23cd001",
      studentName: "Demo Student",
      studentRollNumber: "y23cd001",
      status: "issued",
      requestDate: "2024-03-01",
      approvedDate: "2024-03-02",
      dueDate: "2024-03-16",
    },
  ];
}

/* -------- PROVIDER -------- */

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<BookRequest[]>(generateInitialRequests);
  const [message, setMessage] = useState<string | null>(null);

  const clearMessage = () => setMessage(null);

  /* -------- ADD REQUEST -------- */

  const addRequest = useCallback((req: BookRequest) => {
    setRequests(prev => [req, ...prev]);
  }, []);

  /* -------- ISSUE BOOK -------- */

  const updateRequestStatus = useCallback(
    (requestId: string, status: RequestStatus, dueDate?: string) => {

      setRequests(prev =>
        prev.map(r => {

          if (r.id !== requestId) return r;

          const issuedCount = prev.filter(
            req => req.studentId === r.studentId && req.status === "issued"
          ).length;

          if ((status === "approved" || status === "issued") && issuedCount >= 3) {

            setMessage(
              "Student cannot issue more than 3 books. Please return one book first."
            );

            return r;
          }

          const updated = { ...r, status };

          if (status === "approved" || status === "issued") {

            updated.approvedDate = new Date().toISOString().split("T")[0];

            const due = new Date();
            due.setDate(due.getDate() + 14);

            updated.dueDate = due.toISOString().split("T")[0];
            updated.status = "issued";

            const books = getBooks();
            const book = books.find(b => b.id === r.bookId);

            if (book && book.availableCopies > 0) {
              book.availableCopies--;
              book.available = book.availableCopies > 0;
            }
          }

          return updated;
        })
      );
    },
    []
  );

  /* -------- RETURN BOOK -------- */

  const returnBook = useCallback((requestId: string) => {

    setRequests(prev =>
      prev.map(r => {

        if (r.id !== requestId) return r;

        const books = getBooks();
        const book = books.find(b => b.id === r.bookId);

        if (book) {
          book.availableCopies++;
          book.available = true;
        }

        return {
          ...r,
          status: "returned" as RequestStatus,
          returnDate: new Date().toISOString().split("T")[0],
        };
      })
    );

  }, []);

  /* -------- HELPERS -------- */

  const getStudentRequests = useCallback(
    (studentId: string) => {
      return requests.filter(r => r.studentId === studentId);
    },
    [requests]
  );

  const getStudentBorrowedBooks = useCallback(
    (studentId: string) => {
      return requests.filter(
        r => r.studentId === studentId && r.status === "issued"
      );
    },
    [requests]
  );

  const getPendingRequests = useCallback(() => {
    return requests.filter(r => r.status === "pending");
  }, [requests]);

  const getAllIssuedBooks = useCallback(() => {
    return requests.filter(r => r.status === "issued");
  }, [requests]);

  return (
    <LibraryContext.Provider
      value={{
        requests,
        message,
        clearMessage,
        addRequest,
        updateRequestStatus,
        returnBook,
        getStudentRequests,
        getStudentBorrowedBooks,
        getPendingRequests,
        getAllIssuedBooks,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

/* -------- HOOK -------- */

export function useLibrary() {
  const ctx = useContext(LibraryContext);

  if (!ctx) {
    throw new Error("useLibrary must be used within LibraryProvider");
  }

  return ctx;
}
