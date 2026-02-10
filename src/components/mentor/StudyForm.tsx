import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import CalendarIcon from "../../assets/images/icon/month.svg?react";
import UploadIcon from "../../assets/images/icon/upload.svg?react";
import PencilIcon from "../../assets/images/icon/pen.svg?react";
import InfoIcon from "../../assets/images/icon/info.svg?react";

import type { SubjectKey } from "../SubjectAddButton";
import SubjectSelectButton from "../SubjectSelectButton";
import ToggleSwitch from "../ToggleSwitch";
import Input from "../Input";
import Button from "../Button";
import SquareChip from "../SquareChip";
import ButtonMinus from "../ButtonMinus";
import DatePicker from "../DatePicker";
import { typography } from "../../styles/typography";
import InfoTooltip from "./InfoTooltip";
import { uploadFile } from "../../api/file";

type ResourceMode = "EMPTY" | "CHOICE" | "FILE" | "LINK";
type Mode = "todo" | "resource";

export interface StudyFormResourcePayload {
  subject: SubjectKey;
  resourceName: string;
  fileId?: number;
  columnLink?: string;
}

export interface StudyFormTodoPayload {
  subject: SubjectKey;
  dates: string[];
  taskNames: string[];
  goalMinutes: number;
  worksheets: Array<{ fileId: number }>;
  columnLinks: Array<{ link: string }>;
}

type StudyFormPayload = StudyFormTodoPayload | StudyFormResourcePayload;

interface Props {
  mode: Mode;
  isEdit?: boolean;
  title?: string;
  submitText: string;
  onSubmit: (payload: StudyFormPayload) => void;

  showDate?: boolean;
  showGoalMinutes?: boolean;
  showTaskList?: boolean;

  initialSubject?: SubjectKey;
  initialResourceTitle?: string;
  initialResourceMode?: ResourceMode;
  initialFileId?: number | null;
  initialFileName?: string;
  initialLinkUrl?: string;

  // 추가: Todo 모드 초기값
  initialDates?: string[];
  initialTaskNames?: string[];
  initialGoalMinutes?: number;
}

const StudyForm = ({
  mode,
  isEdit = false,
  title,
  submitText,
  onSubmit,
  showDate = mode === "todo",
  showGoalMinutes = mode === "todo",
  showTaskList = mode === "todo",

  initialSubject,
  initialResourceTitle,
  initialResourceMode,
  initialFileId,
  initialFileName,
  initialLinkUrl,

  initialDates,
  initialTaskNames,
  initialGoalMinutes,
}: Props) => {
  const [subject, setSubject] = useState<SubjectKey>("KOREAN");
  // 날짜
  const [usePeriod, setUsePeriod] = useState(false);
  const [dates, setDates] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // 할일
  const [taskNameInput, setTaskNameInput] = useState("");
  const [taskNames, setTaskNames] = useState<string[]>([]);
  const [goalMinutes, setGoalMinutes] = useState("");
  // 자료(worksheet / link)
  const [resourceMode, setResourceMode] = useState<ResourceMode>("CHOICE");
  const [fileName, setFileName] = useState("");
  const [worksheetFileId, setWorksheetFileId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [didInit, setDidInit] = useState(false);

  useEffect(() => {
    if (didInit) return;

    const hasAnyInitial =
      initialSubject ||
      initialResourceTitle ||
      initialResourceMode ||
      initialFileId != null ||
      initialFileName ||
      initialLinkUrl ||
      initialDates ||
      initialTaskNames ||
      initialGoalMinutes;

    if (!hasAnyInitial) return;

    if (initialSubject) setSubject(initialSubject);
    if (typeof initialResourceTitle === "string")
      setResourceTitle(initialResourceTitle);

    if (initialResourceMode) setResourceMode(initialResourceMode);

    if (typeof initialFileName === "string") setFileName(initialFileName);
    if (initialFileId !== undefined) setWorksheetFileId(initialFileId ?? null);

    if (typeof initialLinkUrl === "string") setLinkUrl(initialLinkUrl);

    // Todo 모드 초기값 세팅
    if (initialDates && initialDates.length > 0) setDates(initialDates);
    if (initialTaskNames && initialTaskNames.length > 0) setTaskNames(initialTaskNames);
    if (initialGoalMinutes !== undefined) setGoalMinutes(String(initialGoalMinutes));

    setDidInit(true);
  }, [
    didInit,
    initialSubject,
    initialResourceTitle,
    initialResourceMode,
    initialFileId,
    initialFileName,
    initialLinkUrl,
    initialDates,
    initialTaskNames,
    initialGoalMinutes,
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isResourceRequired = mode === "resource";

  const openFilePicker = () => fileInputRef.current?.click();

  const getTodayYYYYMMDD = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const expandDates = (start: string, end: string) => {
    const toUTCDate = (s: string) => new Date(`${s}T00:00:00Z`);
    const toYMD = (d: Date) => d.toISOString().slice(0, 10);

    let s = toUTCDate(start);
    let e = toUTCDate(end);

    if (Number.isNaN(+s) || Number.isNaN(+e)) return [];
    if (s > e) {
      // start/end 반대로 들어온 경우 swap
      const tmp = s;
      s = e;
      e = tmp;
    }

    const out: string[] = [];
    for (
      let cur = new Date(s);
      cur <= e;
      cur.setUTCDate(cur.getUTCDate() + 1)
    ) {
      out.push(toYMD(cur));
    }
    return out;
  };

  const applyFile = async (file?: File | null) => {
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadFile(file, "/worksheets"); // 폴더는 정책대로
      setWorksheetFileId(res.fileId);

      setFileName(file.name);
      setLinkUrl("");
      setResourceMode("FILE");
    } catch (e) {
      console.error(e);
      alert("파일 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const onDropUpload = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    applyFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeResource = () => {
    setFileName("");
    setWorksheetFileId(null);
    setLinkUrl("");
    setResourceMode("CHOICE");
  };

  const addTaskName = () => {
    const v = taskNameInput.trim();
    if (!v) return;

    if (taskNames.includes(v)) {
      setTaskNameInput("");
      return;
    }

    setTaskNames((prev) => [...prev, v]);
    setTaskNameInput("");
  };

  const removeTaskName = (idx: number) => {
    setTaskNames((prev) => prev.filter((_, i) => i !== idx));
  };

  const todayPlaceholder = useMemo(() => getTodayYYYYMMDD(), []);

  const resolvedDates = useMemo(() => {
    if (!showDate) return [];
    if (!usePeriod) return dates;
    if (!startDate.trim() || !endDate.trim()) return [];
    return expandDates(startDate.trim(), endDate.trim());
  }, [showDate, usePeriod, dates, startDate, endDate]);

  const isValid = useMemo(() => {
    const hasSubject = !!subject;

    const hasDate = !showDate ? true : resolvedDates.length > 0;

    const hasName = showTaskList
      ? taskNames.length > 0
      : resourceTitle.trim().length > 0;

    const minutes = Number(goalMinutes);
    const hasMinutes = !showGoalMinutes
      ? true
      : goalMinutes.trim().length > 0 && !Number.isNaN(minutes) && minutes > 0;

    const hasFileOk =
      resourceMode !== "FILE"
        ? true
        : !uploading && worksheetFileId != null && fileName.trim().length > 0;

    const hasLinkOk =
      resourceMode !== "LINK" ? true : linkUrl.trim().length > 0;

    return (
      hasSubject && hasDate && hasName && hasMinutes && hasFileOk && hasLinkOk
    );
  }, [
    subject,
    showDate,
    resolvedDates,
    showTaskList,
    taskNames,
    showGoalMinutes,
    goalMinutes,
    resourceMode,
    uploading,
    worksheetFileId,
    fileName,
    linkUrl,
  ]);

  const handleSubmit = () => {
    if (mode === "resource") {
      const payload: StudyFormResourcePayload = {
        subject,
        resourceName: resourceTitle.trim(),
        ...(worksheetFileId != null ? { fileId: worksheetFileId } : {}),
        ...(resourceMode === "LINK" && linkUrl.trim()
          ? { columnLink: linkUrl.trim() }
          : {}),
      };

      onSubmit(payload);
      return;
    }

    const payload: StudyFormTodoPayload = {
      subject,
      dates: resolvedDates,
      taskNames,
      goalMinutes: Number(goalMinutes),
      worksheets: worksheetFileId != null ? [{ fileId: worksheetFileId }] : [],
      columnLinks:
        resourceMode === "LINK" && linkUrl.trim()
          ? [{ link: linkUrl.trim() }]
          : [],
    };

    onSubmit(payload);
  };

  return (
    <Wrap>
      {title && <FormTitle>{title}</FormTitle>}
      <FormGrid>
        {/* 과목 */}
        <Row>
          <RowLabel>
            과목 <Required>*</Required>
          </RowLabel>
          <RowBody>
            <SubjectSelectButton value={subject} onChange={setSubject} />
          </RowBody>
        </Row>

        {/* 날짜(옵션) */}
        {showDate && (
          <Row>
            <RowTop>
              <RowLabel>
                날짜 <Required>*</Required>
              </RowLabel>

              <ToggleWrap>
                <Info>
                  <InfoTooltip
                    message="설정한 기간 동안 매일 할 일이 등록됩니다."
                    align="center"
                    icon={
                      <InfoWrap>
                        <InfoIcon />
                      </InfoWrap>
                    }
                  />
                  <ToggleText>기간으로 받기</ToggleText>
                </Info>
                <ToggleSwitch
                  on={usePeriod}
                  onChange={(next) => {
                    setUsePeriod(next);
                    if (next) {
                      setDates([]);
                    } else {
                      if (endDate.trim()) setDates([endDate.trim()]);
                      else if (startDate.trim()) setDates([startDate.trim()]);
                    }
                  }}
                />
              </ToggleWrap>
            </RowTop>

            <RowBody>
              {!usePeriod ? (
                <Input
                  value={dates.join(", ")}
                  onChange={() => {}}
                  placeholder={todayPlaceholder}
                  readOnly
                  rightIcon={
                    <DatePicker
                      mode="multiple"
                      value={dates}
                      onChange={(next) => setDates(next as string[])}
                      icon={<CalendarIcon />}
                      popoverAlign="end"
                    />
                  }
                />
              ) : (
                <PeriodGrid>
                  <Input
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder={todayPlaceholder}
                    rightIcon={
                      <DatePicker
                        mode="single"
                        value={startDate}
                        onChange={(next) => setStartDate(next as string)}
                        icon={<CalendarIcon />}
                        popoverAlign="end"
                      />
                    }
                    readOnly={false}
                  />
                  <Input
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder={todayPlaceholder}
                    rightIcon={
                      <DatePicker
                        mode="single"
                        value={endDate}
                        onChange={(next) => setEndDate(next as string)}
                        icon={<CalendarIcon />}
                        popoverAlign="end"
                      />
                    }
                    readOnly={false}
                  />
                </PeriodGrid>
              )}
            </RowBody>
          </Row>
        )}

        {/* 할 일 목록 or 자료 이름 */}
        {showTaskList ? (
          <Row>
            <RowTop>
              <RowLabel>
                할 일 이름 <Required>*</Required>
              </RowLabel>

              {!isEdit && (
                <AddBtn>
                  <Button onClick={addTaskName} disabled={!taskNameInput.trim()}>
                    추가
                  </Button>
                </AddBtn>
              )}
            </RowTop>

            {!isEdit && (
              <RowBody>
                <Input
                  value={taskNameInput}
                  onChange={(e) => setTaskNameInput(e.target.value)}
                  placeholder=""
                  maxLength={50}
                  showCount
                  countPosition="bottom"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTaskName();
                    }
                  }}
                />
              </RowBody>
            )}

            {taskNames.length > 0 && (
              <AddedList>
                {taskNames.map((name, idx) => (
                  <AddedItem key={idx} $isEdit={isEdit}>
                    <AddedInputWrap>
                      <Input
                        value={name}
                        onChange={(e) => {
                          const next = e.target.value;
                          setTaskNames((prev) =>
                            prev.map((v, i) => (i === idx ? next : v)),
                          );
                        }}
                        placeholder="예: 영단어 10개 외우기"
                        maxLength={50}
                        showCount
                        countPosition="bottom"
                      />
                    </AddedInputWrap>

                    {!isEdit && <ButtonMinus onClick={() => removeTaskName(idx)} />}
                  </AddedItem>
                ))}
              </AddedList>
            )}
          </Row>
        ) : (
          <Row>
            <RowLabel>
              자료 이름 <Required>*</Required>
            </RowLabel>

            <RowBody>
              <Input
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                placeholder="예: 오답노트 양식"
                maxLength={50}
                showCount
                countPosition="bottom"
              />
            </RowBody>
          </Row>
        )}

        {/* 목표 시간 */}
        {showGoalMinutes && (
          <Row>
            <RowLabel>
              목표 시간 (분) <Required>*</Required>
            </RowLabel>

            <RowBody>
              <InputWrap>
                <Input
                  value={goalMinutes}
                  onChange={(e) => {
                    const next = e.target.value.replace(/[^\d]/g, "");
                    setGoalMinutes(next);
                  }}
                  placeholder="예: 60"
                  inputMode="numeric"
                />
              </InputWrap>
            </RowBody>
          </Row>
        )}

        {/* 학습 자료 */}
        <Row>
          <RowLabel>
            학습 자료 {isResourceRequired && <Required>*</Required>}
          </RowLabel>

          <RowBody>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => applyFile(e.target.files?.[0])}
            />

            {resourceMode === "CHOICE" && (
              <ResourceGrid>
                <SquareChip
                  onClick={() => {
                    setFileName("");
                    setWorksheetFileId(null);
                    setLinkUrl("");
                    setResourceMode("EMPTY");
                  }}
                >
                  <Inner>
                    <Icon>
                      <UploadIcon />
                    </Icon>
                    <Inner1>
                      <Title>PDF 파일 업로드</Title>
                      <Desc>학습 자료를 첨부하세요.</Desc>
                    </Inner1>
                  </Inner>
                </SquareChip>

                <SquareChip
                  onClick={() => {
                    setFileName("");
                    setWorksheetFileId(null);
                    setLinkUrl("");
                    setResourceMode("LINK");
                  }}
                >
                  <Inner>
                    <Icon>
                      <PencilIcon />
                    </Icon>
                    <Inner1>
                      <Title>설스터디 칼럼 링크</Title>
                      <Desc>칼럼 URL을 입력하세요.</Desc>
                    </Inner1>
                  </Inner>
                </SquareChip>
              </ResourceGrid>
            )}

            {resourceMode === "EMPTY" && (
              <SquareChip
                onClick={openFilePicker}
                onDragOver={onDragOver}
                onDrop={onDropUpload}
              >
                <Inner>
                  <Icon>
                    <UploadIcon />
                  </Icon>
                  <Inner1>
                    <Title>
                      {uploading
                        ? "업로드 중..."
                        : "파일을 드래그하거나 클릭하여 업로드"}
                    </Title>
                    <Desc>PDF 파일만 지원합니다.</Desc>
                  </Inner1>
                </Inner>
              </SquareChip>
            )}

            {resourceMode === "FILE" && (
              <ResourceRow>
                <ResourceInput>
                  <Input value={fileName} onChange={() => {}} readOnly />
                </ResourceInput>
                <ButtonMinus onClick={removeResource} />
              </ResourceRow>
            )}

            {resourceMode === "LINK" && (
              <ResourceRow>
                <ResourceInput>
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://seolstudy.com/column/..."
                  />
                </ResourceInput>
                <ButtonMinus onClick={removeResource} />
              </ResourceRow>
            )}
          </RowBody>
        </Row>
      </FormGrid>

      <Bottom>
        <Button disabled={!isValid} onClick={handleSubmit}>
          {submitText}
        </Button>
      </Bottom>
    </Wrap>
  );
};

const Wrap = styled.section`
  width: 100%;
`;

const FormTitle = styled.h3`
  ${typography.t18sb}
  color: var(--color-black);
  margin: 0 0 24px 0;
  text-align: left;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const RowLabel = styled.div`
  text-align: left;
  ${typography.t14sb}
  color: var(--color-black);
`;

const Required = styled.span`
  color: var(--color-primary-500);
  margin-left: 4px;
`;

const RowBody = styled.div`
  width: 100%;
`;

const ToggleWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  color: var(--color-gray-700);
`;

const Info = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 3px;
`;

const ToggleText = styled.span`
  ${typography.t14r}
  color: var(--color-gray-700);
`;

const PeriodGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 744px) {
    grid-template-columns: 1fr;
  }
`;

const AddBtn = styled.div`
  display: flex;
  align-items: center;

  & > * {
    width: 49px;
    height: 36px;
    ${typography.t14sb}
  }
`;

const AddedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;
`;

const AddedItem = styled.div<{ $isEdit?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isEdit }) => ($isEdit ? "1fr" : "1fr 44px")};
  gap: 12px;
  align-items: start;
`;

const AddedInputWrap = styled.div`
  width: 100%;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Inner1 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const Icon = styled.div`
  display: grid;
  place-items: center;

  svg {
    width: 32px;
    height: 32px;
  }

  svg path {
    stroke: var(--color-blue-500);
  }
`;

const InfoWrap = styled.div`
  display: grid;
  place-items: center;

  svg {
    width: 25px;
    height: 25px;
  }

  svg path {
    stroke: var(--color-primary-500);
  }
`;

const ResourceRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 44px;
  gap: 12px;
  align-items: center;
`;

const ResourceInput = styled.div`
  width: 100%;
`;

const Title = styled.div`
  ${typography.t16sb}
`;

const Desc = styled.div`
  ${typography.t14r}
  color: var(--color-gray-500);
`;

const Bottom = styled.div`
  margin-top: 45px;
`;

const InputWrap = styled.div`
  max-width: 510px;
`;

export default StudyForm;
