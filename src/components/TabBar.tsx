import styled from "styled-components";

interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: readonly TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

const TabBar = ({ items, activeKey, onChange }: TabsProps) => {
  return (
    <TabsWrap role="tablist">
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <TabButton
            key={item.key}
            type="button"
            $active={active}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </TabButton>
        );
      })}
    </TabsWrap>
  );
};

const TabsWrap = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const TabButton = styled.button<{ $active: boolean }>`
  position: relative;

  padding: 6px 0;
  border: 0;
  background: none;

  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  line-height: 24px;

  color: ${({ $active }) =>
    $active ? "var(--color-black)" : "var(--color-gray-400)"};

  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0px;

    width: 100%;
    height: 2px;
    background: var(--color-black);

    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: center;
    transition: transform 0.2s ease;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 2px 0 var(--color-primary-500);
  }
`;

export default TabBar;
