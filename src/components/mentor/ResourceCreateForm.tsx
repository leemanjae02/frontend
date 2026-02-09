import { useParams, useNavigate } from "react-router-dom";
import StudyForm, { type StudyFormResourcePayload } from "./StudyForm";
import {
  createResource,
  getResourceDetail,
  updateResource,
  type ResourceItem,
} from "../../api/resource";
import { useEffect, useMemo, useState } from "react";

const ResourceCreateForm = () => {
  const { menteeId, resourceId } = useParams();
  const navigate = useNavigate();

  const menteeIdNum = Number(menteeId);
  const isEdit = !!resourceId;

  const [detail, setDetail] = useState<ResourceItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    if (!resourceId) return;

    const run = async () => {
      try {
        setLoading(true);
        const res = await getResourceDetail(Number(resourceId));
        setDetail(res);
      } catch (e) {
        console.error(e);
        alert("자료 정보를 불러오지 못했습니다.");
        navigate("..", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [isEdit, resourceId, navigate]);

  const initial = useMemo(() => {
    if (!detail) return null;

    const firstWorksheet = detail.worksheets?.[0];
    const firstLink = detail.columnLinks?.[0]?.link;

    if (firstWorksheet) {
      return {
        initialSubject: detail.subject,
        initialResourceTitle: detail.resourceName,
        initialResourceMode: "FILE" as const,
        initialFileId: firstWorksheet.fileId,
        initialFileName: firstWorksheet.fileName,
        initialLinkUrl: "",
      };
    }

    if (firstLink) {
      return {
        initialSubject: detail.subject,
        initialResourceTitle: detail.resourceName,
        initialResourceMode: "LINK" as const,
        initialFileId: null,
        initialFileName: "",
        initialLinkUrl: firstLink,
      };
    }

    return {
      initialSubject: detail.subject,
      initialResourceTitle: detail.resourceName,
      initialResourceMode: "CHOICE" as const,
      initialFileId: null,
      initialFileName: "",
      initialLinkUrl: "",
    };
  }, [detail]);

  if (isEdit && (loading || !initial)) {
    return <div style={{ padding: 24 }}>불러오는 중...</div>;
  }

  return (
    <StudyForm
      mode="resource"
      submitText={isEdit ? "자료 수정하기" : "자료 등록하기"}
      showDate={false}
      showGoalMinutes={false}
      showTaskList={false}
      {...(isEdit && initial ? initial : {})}
      onSubmit={async (payload) => {
        const p = payload as StudyFormResourcePayload; // 추후 StudyForm에서 타입 정리 예정

        if (!menteeIdNum || Number.isNaN(menteeIdNum)) {
          alert("menteeId가 올바르지 않습니다.");
          return;
        }

        try {
          if (!isEdit) {
            await createResource({
              menteeId: menteeIdNum,
              subject: p.subject,
              resourceName: p.resourceName,
              ...(p.fileId != null ? { fileId: p.fileId } : {}),
              ...(p.columnLink ? { columnLink: p.columnLink } : {}),
            });
            alert("자료가 등록되었습니다.");
          } else {
            const rid = Number(resourceId);
            await updateResource(rid, {
              subject: p.subject,
              resourceName: p.resourceName,
              ...(p.fileId != null ? { fileId: p.fileId } : {}),
              ...(p.columnLink ? { columnLink: p.columnLink } : {}),
            });
            alert("자료가 수정되었습니다.");
          }

          navigate(`/mentor/mentees/${menteeIdNum}/resources`, {
            replace: true,
          });
        } catch (e) {
          console.error(e);
          alert(
            isEdit ? "자료 수정에 실패했습니다." : "자료 등록에 실패했습니다.",
          );
        }
      }}
    />
  );
};

export default ResourceCreateForm;
