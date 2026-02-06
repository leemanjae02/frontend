import { useMemo } from "react";
import styled from "styled-components";

import TodoDetailHeader from "../../components/mentee/TodoDetailHeader";
import { mockTodoFeedbackDetail } from "../../menteeTodoFeedbackDetail.mock";
import NumberBadge from "../../components/NumberBadge";
import Indicator from "../../components/mentee/Indicator";
import OverallFeedback from "../../components/mentee/OverallFeedback";
import PhotoFeedback from "../../components/mentee/PhotoFeedback";

const TodoFeedbackDetailPage = () => {
  const data = mockTodoFeedbackDetail;

  const hasPhotos = data.photos.length > 0;
  const activePhotoIndex = 0;

  const activeBadges = useMemo(
    () => data.badgesByPhoto[activePhotoIndex] ?? [],
    [data.badgesByPhoto, activePhotoIndex],
  );

  return (
    <Page>
      <TodoDetailHeader
        title={data.todoTitle}
        subject={data.subject}
        onClickBack={() => history.back()}
      />

      <Body>
        {hasPhotos ? (
          <PhotoArea>
            <PhotoFrame>
              <Photo src={data.photos[activePhotoIndex]} alt="" />
              {activeBadges.map((b) => (
                <BadgeSpot
                  key={b.id}
                  style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%` }}
                >
                  <NumberBadge value={b.value} variant={b.variant} />
                </BadgeSpot>
              ))}
            </PhotoFrame>

            <IndicatorWrap>
              <Indicator
                count={data.photos.length}
                activeIndex={activePhotoIndex}
              />
            </IndicatorWrap>
          </PhotoArea>
        ) : null}

        <OverallFeedback mentorName={data.overallMentorName} defaultOpen />

        {hasPhotos && data.photoFeedbacks.length > 0 ? (
          <Sections>
            {data.photoFeedbacks.map((sec) => (
              <PhotoFeedback
                key={sec.photoNumber}
                photoNumber={sec.photoNumber}
                items={sec.items}
                defaultOpen={sec.defaultOpen}
              />
            ))}
          </Sections>
        ) : null}
      </Body>
    </Page>
  );
};

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--color-white);
`;
const Body = styled.main`
  width: 100%;
`;
const PhotoArea = styled.section`
  padding: 12px 16px 8px;
`;
const PhotoFrame = styled.div`
  position: relative;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: var(--color-gray-100);
`;
const Photo = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;
const BadgeSpot = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
`;
const IndicatorWrap = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
`;
const Sections = styled.div`
  width: 100%;
`;

export default TodoFeedbackDetailPage;
