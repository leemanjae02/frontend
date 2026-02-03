import { useState } from "react";
import styled from "styled-components";
import BottomSheet from "../components/BottomSheet"; // 분리한 파일 import
import TodoForm from "../components/TodoForm";

// 모바일 화면 시뮬레이션 컨테이너
const MobileScreen = styled.div`
  width: 375px;
  height: 100vh;
  margin: 0 auto;
  background-color: #f2f4f6;
  position: relative;
  overflow: hidden;
  border: 1px solid #ddd;
`;

// + 플로팅 버튼
const FloatingButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--color-primary-500);
  color: white;
  font-size: 30px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--color-primary-600);
  }
`;

const MainPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return (
    <MobileScreen>
      {/* 이쪽에 다른 컴포넌트들 넣으면 됩니다!! */}

      <div style={{ padding: "20px" }}>
        <h1>오늘의 할 일</h1>
        <p>우측 하단 + 버튼을 눌러보세요.</p>
      </div>

      <FloatingButton onClick={openForm}>+</FloatingButton>

      {/* 바텀시트 사용: 드래그 로직은 BottomSheet 내부로 숨겨짐 */}
      <BottomSheet isOpen={isFormOpen} onClose={closeForm}>
        <TodoForm
          mode="create"
          onSubmit={(data) => {
            console.log("제출 데이터:", data);
            closeForm();
          }}
        />
      </BottomSheet>
    </MobileScreen>
  );
};

export default MainPage;
