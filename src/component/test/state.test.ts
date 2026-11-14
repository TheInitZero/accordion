import { describe, expect, it } from "vitest";
import { update } from "../state";

describe("update", () => {
  describe("open", () => {
    it("should add value when multiple mode and value is not open", () => {
      const result = update({
        model: ["a"],
        message: { type: "open", value: "b" },
        hasMultipleOpenPanels: true,
      });

      expect(result).toEqual(["a", "b"]);
    });

    it("should replace open value when single mode and another value opens", () => {
      const result = update({
        model: ["a"],
        message: { type: "open", value: "b" },
        hasMultipleOpenPanels: false,
      });

      expect(result).toEqual(["b"]);
    });

    it("should return same model when value is already open", () => {
      const model = ["a", "b"];

      const result = update({
        model,
        message: { type: "open", value: "a" },
        hasMultipleOpenPanels: true,
      });

      expect(result).toBe(model);
    });
  });

  describe("close", () => {
    it("should remove value when value is open", () => {
      const result = update({
        model: ["a", "b"],
        message: { type: "close", value: "a" },
        hasMultipleOpenPanels: true,
      });

      expect(result).toEqual(["b"]);
    });

    it("should keep model contents when value is not open", () => {
      const result = update({
        model: ["a"],
        message: { type: "close", value: "b" },
        hasMultipleOpenPanels: true,
      });

      expect(result).toEqual(["a"]);
    });
  });
});
