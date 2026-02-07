import StudyForm from "./StudyForm";

const ResourceCreateForm = () => {
  return (
    <StudyForm
      mode="resource"
      submitText="자료 등록하기"
      onSubmit={(payload) => {
        console.log(payload);
        alert("자료 등록 API 연결 예정");
      }}
      showDate={false}
      showGoalMinutes={false}
      showTaskList={false}
      resourceStartMode="EMPTY"
    />
  );
};

export default ResourceCreateForm;
