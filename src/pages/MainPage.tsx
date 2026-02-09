import { useState, useEffect } from "react";
import styled from "styled-components";

import BottomSheet from "../components/mentee/BottomSheet";
import TodoForm from "../components/TodoForm";
import TaskDetailContainer from "../components/mentee/TaskDetailContainer";
import PhotoUploadOverlay from "../components/mentee/PhotoUploadOverlay";
import Calendar from "../components/Calendar";
import Dashboard from "../components/mentee/Dashboard";
import Header from "../components/mentee/Header";
import TodoCard from "../components/mentee/TodoCard";
import ToggleSwitch from "../components/ToggleSwitch";
import SubjectAddButton from "../components/SubjectAddButton";
import TaskCompletionModal from "../components/mentee/TaskCompletionModal";
import { typography } from "../styles/typography";
import type { SubjectKey } from "../components/SubjectAddButton";

import {
  getTasksByDate,
  createTask,
  updateTask,
  toggleTaskComplete,
  type DailyTask,
} from "../api/task";
import { uploadFile, submitProofShots } from "../api/file";
import { dateUtils } from "../utils/dateUtils";
import type { ImageMarkerData } from "../components/mentee/PhotoUploadOverlay";
import type { DashboardSummaryData } from "../components/mentee/Dashboard";
import FeedbackDetailOverlay from "../components/mentee/FeedbackDetailOverlay";

const MobileScreen = styled.div`
  min-width: 375px;
  max-width: 430px;
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  row-gap: 16px;
  background-color: var(--color-white);
  overflow: hidden;
`;

const DashboardWrapper = styled.div`
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  padding: 18px 16px;
  border-bottom: 1px solid var(--color-gray-100);
`;

const TodoSectionWrapper = styled.div<{ $lock: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${({ $lock }) => ($lock ? "pointer-events: none;" : "")}
`;

const ToggleSwitchWrapper = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const ToggleSwitchLabel = styled.p`
  ${typography.t16m}
  color: var(--color-gray-500);
  margin-right: 8px;

  &:nth-child(1) {
    text-align: left;
    margin: 0;
    flex: 1;
    color: var(--color-black);
  }
`;

const SubjectListWrapper = styled.div<{ $lock: boolean }>`
  flex: 1;
  overflow-y: ${({ $lock }) => ($lock ? "hidden" : "auto")};
  padding: 8px 16px;
  box-sizing: border-box;

  /* 스크롤 잠금 중엔 터치 스크롤도 차단 */
  ${({ $lock }) => ($lock ? "touch-action: none;" : "")}

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SubjectGroup = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 과목 순서 정의
const SUBJECT_ORDER = ["KOREAN", "ENGLISH", "MATH"];

interface FeedbackDetailInfo {
  taskId: number;
  subject: string;
  title: string;
}

const MainPage = () => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"DETAIL" | "FORM">("FORM");
  const [isToggle, setIsToggle] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [photoUploadInfo, setPhotoUploadInfo] = useState<{
    subject: string;
    title: string;
  } | null>(null);

  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [pendingCompleteTask, setPendingCompleteTask] = useState<{
    taskId: number;
    taskName: string;
  } | null>(null);

  const [isFeedbackDetailOpen, setIsFeedbackDetailOpen] = useState(false);
  const [feedbackDetailInfo, setFeedbackDetailInfo] =
    useState<FeedbackDetailInfo | null>(null);

  const anyOverlayOpen =
    isBottomSheetOpen ||
    isPhotoUploadOpen ||
    isFeedbackDetailOpen ||
    isCompletionModalOpen;

  const refreshTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getTasksByDate(selectedDate);
      setTasks(response.tasks);
      setDashboardSummary({
        todoCount: {
          done: response.completedTaskAmount,
          total: response.taskAmount,
        },
        minutes: {
          goal: response.goalMinutesTotal,
          done: response.actualMinutesTotal,
        },
      });
    } catch (error) {
      console.error("데이터 로딩 실패", error);
      setTasks([]);
      setDashboardSummary(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, [selectedDate]);

  const handleCardClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setActiveSubject(null);
    setViewMode("DETAIL");
    setIsBottomSheetOpen(true);
  };

  const handleAddButtonClick = (subject: string) => {
    setActiveSubject(subject);
    setSelectedTaskId(null);
    setViewMode("FORM");
    setIsBottomSheetOpen(true);
  };

  const handleSwitchToEdit = () => {
    setIsBottomSheetOpen(false);
    setTimeout(() => {
      setViewMode("FORM");
      setIsBottomSheetOpen(true);
    }, 300);
  };

  const handleFormSubmit = async (formData: { name: string; time: string }) => {
    try {
      if (selectedTaskId) {
        await updateTask(selectedTaskId, {
          taskName: formData.name,
          goalMinutes: Number(formData.time),
        });
      } else if (activeSubject) {
        await createTask({
          subject: activeSubject,
          date: dateUtils.formatToAPIDate(selectedDate),
          taskName: formData.name,
          goalMinutes: Number(formData.time),
        });
      }

      await refreshTasks();
      closeSheet();
    } catch (error) {
      console.error("작업 실패:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleDeleteSuccess = async () => {
    await refreshTasks();
    closeSheet();
  };

  const handleOpenPhotoUpload = (taskInfo: {
    subject: string;
    title: string;
  }) => {
    setPhotoUploadInfo(taskInfo);
    setIsPhotoUploadOpen(true);
  };

  const handleSavePhotos = async (
    images: string[],
    files: File[],
    markersData: ImageMarkerData[],
  ) => {
    setUploadedImages(images);
    setUploadedFiles(files);

    if (files.length > 0 && selectedTaskId) {
      try {
        const uploadResults = await Promise.all(
          files.map((file) => uploadFile(file, "/proof-shots")),
        );

        const proofShots = uploadResults.map((result, idx) => ({
          imageFileId: result.fileId,
          questions: markersData[idx]?.markers || [],
        }));

        await submitProofShots(selectedTaskId, { proofShots });

        alert("인증 사진이 업로드되었습니다.");
        await refreshTasks();
      } catch (error) {
        console.error("사진 업로드 실패:", error);
        alert("사진 업로드에 실패했습니다.");
      }
    }
  };

  const blurActiveElement = () => {
    (document.activeElement as HTMLElement | null)?.blur?.();
  };

  const handleToggleDone = (
    taskId: number,
    taskName: string,
    isCompleted: boolean,
  ) => {
    if (isCompleted) {
      handleCompleteWithoutModal(taskId);
      return;
    }

    blurActiveElement();
    setPendingCompleteTask({ taskId, taskName });
    setIsCompletionModalOpen(true);
  };

  const handleCompleteWithoutModal = async (taskId: number) => {
    try {
      await toggleTaskComplete(taskId, selectedDate);
      await refreshTasks();
    } catch (error) {
      console.error("완료 토글 실패:", error);
      alert("완료 상태 변경에 실패했습니다.");
    }
  };

  const handleCompletionModalSave = async (actualMinutes: number) => {
    if (!pendingCompleteTask) return;

    try {
      await toggleTaskComplete(
        pendingCompleteTask.taskId,
        selectedDate,
        actualMinutes,
      );
      await refreshTasks();
      setIsCompletionModalOpen(false);
      setPendingCompleteTask(null);
    } catch (error) {
      console.error("완료 처리 실패:", error);
      alert("완료 처리에 실패했습니다.");
    }
  };

  const handleCompletionModalClose = () => {
    setIsCompletionModalOpen(false);
    setPendingCompleteTask(null);
  };

  const closeSheet = () => {
    setIsBottomSheetOpen(false);
    setTimeout(() => {
      setSelectedTaskId(null);
      setActiveSubject(null);
    }, 300);
  };

  const openFeedbackDetail = (info: FeedbackDetailInfo) => {
    setIsBottomSheetOpen(false);

    setTimeout(() => {
      setFeedbackDetailInfo(info);
      setIsFeedbackDetailOpen(true);
    }, 300);
  };

  const closeFeedbackDetail = () => {
    setIsFeedbackDetailOpen(false);
    setTimeout(() => setFeedbackDetailInfo(null), 300);
  };

  return (
    <MobileScreen>
      <Header />
      <Calendar
        selectedDate={selectedDate}
        onDateClick={(d) => setSelectedDate(new Date(d))}
      />
      <DashboardWrapper>
        <Dashboard
          summary={dashboardSummary ?? undefined}
          loading={isLoading}
          onClickSubjectStats={() => {
            // TODO: 과목별 통계 페이지 이동
            console.log("과목별 통계 클릭");
          }}
        />
      </DashboardWrapper>
      <TodoSectionWrapper $lock={anyOverlayOpen}>
        <ToggleSwitchWrapper>
          <ToggleSwitchLabel>오늘 할 일</ToggleSwitchLabel>
          <ToggleSwitchLabel>완료한 할 일 보기</ToggleSwitchLabel>
          <ToggleSwitch on={isToggle} onChange={setIsToggle} />
        </ToggleSwitchWrapper>

        <SubjectListWrapper $lock={anyOverlayOpen}>
          {SUBJECT_ORDER.map((subject) => {
            const subjectTasks = tasks.filter(
              (task) => task.taskSubject === subject,
            );
            const visibleTasks = isToggle
              ? subjectTasks
              : subjectTasks.filter((task) => !task.completed);

            return (
              <SubjectGroup key={subject}>
                <SubjectAddButton
                  subject={subject as SubjectKey}
                  onClick={() => handleAddButtonClick(subject)}
                />
                {visibleTasks.map((task) => (
                  <TodoCard
                    key={task.taskId}
                    title={task.taskName}
                    subject={subject as SubjectKey}
                    done={task.completed}
                    fromMentor={task.createdBy === "ROLE_MENTOR"}
                    hasFile={task.hasWorksheet}
                    hasPhoto={task.hasProofShot}
                    feedback={
                      task.hasFeedback
                        ? task.readFeedback
                          ? "READ"
                          : "UNREAD"
                        : "NONE"
                    }
                    onToggleDone={() =>
                      handleToggleDone(
                        task.taskId,
                        task.taskName,
                        task.completed,
                      )
                    }
                    onClick={() => handleCardClick(task.taskId)}
                  />
                ))}
              </SubjectGroup>
            );
          })}
        </SubjectListWrapper>
      </TodoSectionWrapper>

      {isBottomSheetOpen ? (
        <BottomSheet isOpen={isBottomSheetOpen} onClose={closeSheet}>
          {viewMode === "DETAIL" && selectedTaskId ? (
            <TaskDetailContainer
              taskId={selectedTaskId}
              onEditClick={handleSwitchToEdit}
              onDeleteSuccess={handleDeleteSuccess}
              onOpenPhotoUpload={handleOpenPhotoUpload}
              onOpenFeedbackDetail={(taskInfo) => {
                openFeedbackDetail({
                  taskId: selectedTaskId,
                  subject: taskInfo.subject,
                  title: taskInfo.title,
                });
              }}
            />
          ) : (
            <TodoForm
              mode={selectedTaskId ? "edit" : "create"}
              taskId={selectedTaskId}
              onSubmit={handleFormSubmit}
            />
          )}
        </BottomSheet>
      ) : null}

      {/* 사진 업로드 오버레이 */}
      {isPhotoUploadOpen ? (
        <PhotoUploadOverlay
          isOpen={isPhotoUploadOpen}
          onClose={() => {
            setIsPhotoUploadOpen(false);
            closeSheet();
          }}
          initialImages={uploadedImages}
          initialFiles={uploadedFiles}
          onSave={handleSavePhotos}
          subject={photoUploadInfo?.subject ?? ""}
          title={photoUploadInfo?.title ?? ""}
        />
      ) : null}

      {/* 피드백 상세 오버레이 */}
      {isFeedbackDetailOpen && feedbackDetailInfo ? (
        <FeedbackDetailOverlay
          isOpen={isFeedbackDetailOpen}
          onClose={closeFeedbackDetail}
          taskId={feedbackDetailInfo?.taskId ?? null}
          subject={feedbackDetailInfo?.subject ?? ""}
          title={feedbackDetailInfo?.title ?? ""}
        />
      ) : null}

      {/* 완료 시간 입력 모달 */}
      {isCompletionModalOpen ? (
        <TaskCompletionModal
          isOpen={isCompletionModalOpen}
          onClose={handleCompletionModalClose}
          onSave={handleCompletionModalSave}
          title={pendingCompleteTask?.taskName ?? ""}
        />
      ) : null}
    </MobileScreen>
  );
};

export default MainPage;
