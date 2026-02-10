import { useEffect, useState } from "react";
import styled from "styled-components";
import TaskDetailContent, { type TaskDetailData } from "./TaskDetailContent";
import { fetchTaskDetail, deleteTask } from "../../api/task";

interface TaskDetailContainerProps {
  taskId: number;
  onEditClick: () => void;
  onDeleteSuccess: () => void;
  onOpenPhotoUpload?: (taskInfo: { subject: string; title: string }) => void;
  onOpenFeedbackDetail?: (taskInfo: { subject: string; title: string }) => void;
}

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--color-gray-500);
  font-size: 14px;
`;

const TaskDetailContainer = ({
  taskId,
  onEditClick,
  onDeleteSuccess,
  onOpenPhotoUpload,
  onOpenFeedbackDetail,
}: TaskDetailContainerProps) => {
  const [data, setData] = useState<TaskDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(false);
        const detailData = await fetchTaskDetail(taskId);
        setData(detailData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      loadData();
    }
  }, [taskId]);

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 할 일을 삭제하시겠습니까?")) return;

    try {
      await deleteTask(taskId);
      alert("삭제되었습니다.");
      onDeleteSuccess();
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <LoadingWrapper>불러오는 중...</LoadingWrapper>;
  if (error || !data)
    return <LoadingWrapper>정보를 불러올 수 없습니다.</LoadingWrapper>;

  const handleOpenPhotoUpload = () => {
    if (data && onOpenPhotoUpload) {
      onOpenPhotoUpload({
        subject: data.subjectKey,
        title: data.title,
      });
    }
  };

  const handleOpenFeedbackDetail = () => {
    if (onOpenFeedbackDetail) {
      onOpenFeedbackDetail({
        subject: data.subjectKey,
        title: data.title,
      });
    }
  };

  return (
    <TaskDetailContent
      data={data}
      onOpenPhotoUpload={handleOpenPhotoUpload}
      onOpenFeedbackDetail={handleOpenFeedbackDetail}
      onEdit={onEditClick}
      onDelete={handleDelete}
    />
  );
};

export default TaskDetailContainer;
