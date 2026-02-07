import { useMemo, useRef, useState } from "react";
import styled from "styled-components";

import CalendarIcon from "../../../assets/images/icon/month.svg?react";
import UploadIcon from "../../../assets/images/icon/upload.svg?react";
import PencilIcon from "../../../assets/images/icon/pen.svg?react";

import type { SubjectKey } from "../../SubjectAddButton";
import SubjectSelectButton from "../../SubjectSelectButton";
import ToggleSwitch from "../../ToggleSwitch";
import Input from "../../Input";
import Button from "../../Button";
import SquareChip from "../../SquareChip";
import { typography } from "../../../styles/typography";
import ButtonMinus from "../../ButtonMinus";
import DatePicker from "../../DatePicker";

type ResourceMode = "EMPTY" | "CHOICE" | "FILE" | "LINK";

export default function TodoCreateSection() {
  const [subject, setSubject] = useState<SubjectKey>("KOREAN");
  const [usePeriod, setUsePeriod] = useState(false);

  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [taskNameInput, setTaskNameInput] = useState("");
  const [taskNames, setTaskNames] = useState<string[]>([]);
  const [goalMinutes, setGoalMinutes] = useState("");

  const [resourceMode, setResourceMode] = useState<ResourceMode>("EMPTY");
  const [fileName, setFileName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => fileInputRef.current?.click();

  const applyFile = (file?: File | null) => {
    if (!file) return;
    setFileName(file.name);
    setLinkUrl("");
    setResourceMode("FILE");
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
    setLinkUrl("");
    setResourceMode("CHOICE");
  };

  const isValid = useMemo(() => {
    const hasName = taskNames.length > 0;

    const minutes = Number(goalMinutes);
    const hasMinutes =
      goalMinutes.trim().length > 0 && !Number.isNaN(minutes) && minutes > 0;

    const hasDate = !usePeriod
      ? String(date).trim().length > 0
      : String(startDate).trim().length > 0 &&
        String(endDate).trim().length > 0;

    return !!subject && hasDate && hasName && hasMinutes;
  }, [subject, usePeriod, date, startDate, endDate, taskNames, goalMinutes]);

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

  const handleSubmit = () => {
    const payload = {
      subject,
      usePeriod,
      taskNames,
      goalMinutes: Number(goalMinutes),

      ...(usePeriod ? { startDate, endDate } : { date }),
    };

    console.log(payload);
    alert("일 등록 API 연결 예정");
  };

  return (
    <Wrap>
      <FormGrid>
        <Row>
          <RowLabel>
            과목 <Required>*</Required>
          </RowLabel>

          <RowBody>
            <SubjectSelectButton value={subject} onChange={setSubject} />
          </RowBody>
        </Row>

        <Row>
          <RowTop>
            <RowLabel>
              날짜 <Required>*</Required>
            </RowLabel>

            <ToggleWrap>
              <InfoDot />
              <ToggleText>기간으로 받기</ToggleText>
              <ToggleSwitch
                on={usePeriod}
                onChange={(next) => {
                  setUsePeriod(next);

                  if (next) setDate("");
                  else {
                    setStartDate("");
                    setEndDate("");
                  }
                }}
              />
            </ToggleWrap>
          </RowTop>

          <RowBody>
            {!usePeriod ? (
              <Input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                rightIcon={
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    icon={<CalendarIcon />}
                    popoverAlign="end"
                  />
                }
                readOnly={false}
              />
            ) : (
              <PeriodGrid>
                <Input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  rightIcon={
                    <DatePicker
                      value={startDate}
                      onChange={setStartDate}
                      icon={<CalendarIcon />}
                      popoverAlign="end"
                    />
                  }
                  readOnly={false}
                />
                <Input
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  rightIcon={
                    <DatePicker
                      value={endDate}
                      onChange={setEndDate}
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

        <Row>
          <RowTop>
            <RowLabel>
              할 일 이름 <Required>*</Required>
            </RowLabel>

            <AddBtn>
              <Button onClick={addTaskName} disabled={!taskNameInput.trim()}>
                추가
              </Button>
            </AddBtn>
          </RowTop>

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

          {taskNames.length > 0 && (
            <AddedList>
              {taskNames.map((name, idx) => (
                <AddedItem key={`${name}-${idx}`}>
                  <AddedInputWrap>
                    <Input
                      value={name}
                      onChange={(e) => {
                        const next = e.target.value;
                        setTaskNames((prev) =>
                          prev.map((v, i) => (i === idx ? next : v)),
                        );
                      }}
                      maxLength={50}
                      showCount
                      countPosition="bottom"
                    />
                  </AddedInputWrap>

                  <ButtonMinus onClick={() => removeTaskName(idx)} />
                </AddedItem>
              ))}
            </AddedList>
          )}
        </Row>

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

        <Row>
          <RowLabel>학습 자료</RowLabel>

          <RowBody>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => applyFile(e.target.files?.[0])}
            />

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
                    <Title>파일을 드래그하거나 클릭하여 업로드</Title>
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

            {resourceMode === "CHOICE" && (
              <ResourceGrid>
                <SquareChip onClick={openFilePicker}>
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
          할 일 등록하기
        </Button>
      </Bottom>
    </Wrap>
  );
}

const Wrap = styled.section`
  width: 100%;
  margin-bottom: 50px;
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
`;

const RowBody = styled.div`
  width: 100%;
`;

const ToggleWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-gray-700);
`;

const ToggleText = styled.span`
  ${typography.t14r}
  color: var(--color-gray-700);
`;

const InfoDot = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary-50), transparent);
  border: 1px solid var(--color-primary-500);
  position: relative;

  &::after {
    content: "i";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 11px;
    font-weight: 700;
    color: var(--color-primary-500);
    line-height: 1;
  }
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

const AddedItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 44px;
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
