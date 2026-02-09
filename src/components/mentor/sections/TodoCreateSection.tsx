import { useParams } from "react-router-dom";
import StudyForm, { type StudyFormTodoPayload } from "../StudyForm";
import { createTasksByMentor } from "../../../api/task";
import { useEffect } from "react";

const TodoCreateSection = () => {
  const { menteeId } = useParams();

  useEffect(() => {
    console.log("[TodoCreateSection] mounted");
    console.trace("[TodoCreateSection] trace");
  }, []);

  return (
    <StudyForm
      mode="todo"
      submitText="할 일 등록하기"
      onSubmit={async (payload) => {
        const p = payload as StudyFormTodoPayload; // 추후 StudyForm에서 타입 정리 예정

        if (!menteeId) {
          alert("menteeId가 없습니다.");
          return;
        }

        const req = {
          menteeId: Number(menteeId),
          subject: p.subject,
          dates: p.dates,
          taskNames: p.taskNames,
          goalMinutes: p.goalMinutes,
          worksheets: p.worksheets,
          columnLinks: p.columnLinks,
        };

        try {
          const created = await createTasksByMentor(req);
          alert("할 일이 등록되었습니다.");
          console.log("created tasks:", created);
        } catch (e) {
          console.error(e);
          alert("할 일 등록에 실패했습니다.");
        }
      }}
    />
  );
};

export default TodoCreateSection;
