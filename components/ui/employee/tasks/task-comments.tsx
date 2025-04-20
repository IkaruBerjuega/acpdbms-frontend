import {
  useGetSpecificTaskComments,
  useTaskActions,
} from "@/hooks/api-calls/employee/use-tasks";
import { Input } from "../../input";
import { Button, ButtonTooltip } from "../../button";
import { useUserBasicInfo } from "@/hooks/api-calls/admin/use-account";
import { getInitialsFallback } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { useState } from "react";
import {
  TaskComment,
  TaskCommentInterface,
  TaskCommentRequest,
} from "@/lib/tasks-definitions";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "../../separator";

function transformComments(comments: TaskComment[]): TaskCommentInterface[] {
  const commentMap = new Map<number, TaskCommentInterface>();
  const rootComments: TaskCommentInterface[] = [];

  // Step 1: Convert flat comments into a map
  comments.forEach((comment) => {
    commentMap.set(comment.id, {
      id: comment.id,
      name: comment.name,
      profile_picture_url: comment.profile_picture_url,
      status: comment.status,
      content: comment.content,
      created_at: comment.created_at,
      role: comment.role,
      children: [],
    });
  });

  // Step 2: Build the tree by linking replies to their parent
  comments.forEach((comment) => {
    if (comment.reply_to !== null) {
      const parent = commentMap.get(comment.reply_to);
      if (parent) {
        parent.children?.push(commentMap.get(comment.id)!);
      }
    } else {
      rootComments.push(commentMap.get(comment.id)!);
    }
  });

  return rootComments;
}

interface MessageInputProps {
  placeholder: string;
  handleSend: (
    event: React.FormEvent<HTMLFormElement>,
    inputValue: string
  ) => void;
  focusOnInput: boolean;
}

function MessageInput({
  placeholder = "Say something here",
  handleSend,
  focusOnInput,
}: MessageInputProps) {
  const { data: userInfo } = useUserBasicInfo();

  const [message, setMessage] = useState<string>("");
  const name = userInfo?.full_name || "Admin";
  const profileSrc = userInfo?.profile_picture_url;
  const initialsAsProfileSrcFallback = getInitialsFallback(name);

  return (
    <form
      onSubmit={(e) => {
        handleSend(e, message);
        setMessage("");
      }}
      className="w-full flex-row-center gap-2 "
    >
      <div className="flex-grow flex-row-center gap-2">
        <Avatar className="border-[1px]">
          <AvatarImage src={profileSrc} />
          <AvatarFallback>{initialsAsProfileSrcFallback}</AvatarFallback>
        </Avatar>
        <Input
          className="flex-1"
          autoFocus={focusOnInput}
          placeholder={placeholder}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setMessage(value);
          }}
          value={message}
        />
      </div>
      <Button size={"sm"} className="" type="submit">
        Send
      </Button>
    </form>
  );
}

interface MessageInterfaceProps {
  comment: TaskCommentInterface;
  onClick: (props: TaskCommentInterface) => void;
}

function Message({ comment, onClick }: MessageInterfaceProps) {
  const isClient = comment.role === "client";

  return (
    <div className="flex-col-start gap-1 w-full text-xs relative">
      <div className="flex-row-start-center gap-2">
        <Avatar className="border-[1px] h-7 w-7">
          <AvatarImage src={comment.profile_picture_url} />
          <AvatarFallback>
            {getInitialsFallback(comment.name ?? "")}
          </AvatarFallback>
        </Avatar>
        <p className="text-black-primary">
          {comment.name} {isClient && "(Client)"}
        </p>
        <p>•</p>
        <p>{comment.created_at}</p>
      </div>
      <div className="pl-10 flex-col-start gap-4">
        <div className="flex-col-start gap-3">
          <div className="text-[13px]">{comment.content}</div>
          <div>
            <Button
              variant={"outline"}
              size={"sm"}
              className="text-xs px-2 h-6 "
              onClick={() => onClick(comment)}
            >
              Reply
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {!!comment.children &&
            comment.children.map((comment) => (
              <Message key={comment.id} comment={comment} onClick={onClick} />
            ))}
        </div>
      </div>
      <Separator
        className="h-full absolute -z-50 left-3.5"
        orientation="vertical"
      />
    </div>
  );
}

export default function TaskComments({
  taskId,
  projectId,
}: {
  taskId: string | undefined;
  projectId: string;
}) {
  const [replyReference, setReplyReference] = useState<TaskCommentInterface>();
  const [focusOnMessageInput, setFocusOnMessageInput] = useState<boolean>(true);

  const { storeComment } = useTaskActions({
    taskId: taskId,
    projectId: projectId,
  });

  const { data: commentsResponse, isLoading } = useGetSpecificTaskComments({
    taskId: taskId || "",
  });

  const onReply = (props: TaskCommentInterface) => {
    setReplyReference(props);
    setFocusOnMessageInput(true);
  };
  const resetReference = () => {
    setReplyReference(undefined);
  };

  const queryClient = useQueryClient();
  const comments = commentsResponse?.comments;

  const transformedComments = transformComments(comments ?? []);

  const handleSend = (
    event: React.FormEvent<HTMLFormElement>,
    inputValue: string
  ) => {
    event.preventDefault(); // Prevents page reload

    const body: TaskCommentRequest = {
      content: inputValue,
      reply_to: replyReference?.id || null,
    };

    storeComment.mutate(body, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["tasks", projectId] }),
          queryClient.invalidateQueries({
            queryKey: ["task-versions", taskId],
          }),
          queryClient.invalidateQueries({
            queryKey: ["task-comments", taskId],
          }),
        ]);
        resetReference();
      },
      onError: (error: { message: string }) => {
        toast({
          variant: "destructive",
          title: "Send request",
          description:
            error.message || "There was an error sending the request",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex-col-between-start ">
        <div className="w-full text-sm text-slate-500 flex-grow flex-col-center ">
          Loading messages...
        </div>
        <MessageInput
          placeholder={""}
          handleSend={handleSend}
          focusOnInput={focusOnMessageInput}
        />
      </div>
    );
  }

  if (!comments) {
    return (
      <div className="flex-grow flex-col-between-start ">
        <div className="w-full text-sm text-slate-500 flex-grow flex-col-center ">
          No comments for this task
        </div>
        <MessageInput
          placeholder={""}
          handleSend={handleSend}
          focusOnInput={focusOnMessageInput}
        />
      </div>
    );
  }

  return (
    <div className="flex-grow flex-col-between-start min-h-0 py-1">
      <div className="w-full text-sm text-slate-500 flex-grow flex-col-start gap-4 overflow-y-auto ">
        {transformedComments.map((comment) => {
          return (
            <Message key={comment.id} comment={comment} onClick={onReply} />
          );
        })}
      </div>

      <div className="w-full flex-col-start bg-white-primary border-t-[1px] ">
        {replyReference && (
          <div className="flex-col-start text-xs gap-2  border-b-[1px] p-2 relative">
            <div className="text-black-primary font-semibold">
              Replying to {replyReference.name}
            </div>
            <div className="text-slate-500">{replyReference.content}</div>
            <ButtonTooltip
              tooltip={"Remove reply"}
              iconSrc="/button-svgs/sidepanel-close.svg"
              className="absolute right-2 top-1/4 border-0"
              onClick={resetReference}
            />
          </div>
        )}
        <div className="w-full pt-4">
          <MessageInput
            placeholder={"Say something here..."}
            handleSend={handleSend}
            focusOnInput={focusOnMessageInput}
          />
        </div>
      </div>
    </div>
  );
}
