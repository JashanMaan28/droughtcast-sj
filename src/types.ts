export type RawRow = {
  Date: string;
  Snowpack: string;
  Precip: string;
  Reservoir: string;
};

export type Row = {
  date: Date;
  year: number;
  month: number; // 1-12
  snowpack: number;
  precip: number;
  reservoir: number;
};

export type DroughtStage = "Normal" | "Watch" | "Warning" | "Emergency";

export type Horizon = 1 | 3 | 6 | 12;
