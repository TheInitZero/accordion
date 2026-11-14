import { Accordion } from "./component";

export default function App() {
  return (
    <Accordion.Root defaultOpenValues={["shipping"]}>
      <Accordion.Item value="shipping">
        <Accordion.Trigger>What are your shipping options?</Accordion.Trigger>
        <Accordion.Content>
          Standard (5-7 days), express (2-3 days), or overnight.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="returns">
        <Accordion.Trigger>What is your return policy?</Accordion.Trigger>
        <Accordion.Content>
          Returns are accepted within 30 days.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="premium" isDisabled>
        <Accordion.Trigger>Premium feature information</Accordion.Trigger>
        <Accordion.Content>Available on paid plans.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
