import StudyForm from "../StudyForm";

const TodoCreateSection = () => {
  return (
    <StudyForm
      mode="todo"
      submitText="할 일 등록하기"
      onSubmit={(payload) => {
        console.log(payload);
        alert("일 등록 API 연결 예정");
      }}
      resourceStartMode="EMPTY"
    />
  );
};

export default TodoCreateSection;
