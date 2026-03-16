import { Card } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface StatisticProps {
  headerTextLeft: string;
  colorHeaderTextRight?: string;
  headerIconRight?: ReactNode;
  headerTextRight?: string;

  textColor?: string;
  text?: string;
  linkDetailText?: string;
  linkDetailPath?: string;
  footerIcon?: ReactNode;
}

export default function Statistic({
  headerTextLeft,
  headerTextRight,
  colorHeaderTextRight,
  headerIconRight,
  textColor,
  text,
  footerIcon,
  linkDetailPath,
  linkDetailText,
}: StatisticProps) {
  return (
    <Card variant="borderless">
      <div className="flex items-center justify-between">
        <span className="text-gray-600 font-bold text-shadow-2xs text-[16px]">{headerTextLeft}</span>
        {headerIconRight && (
          <span className="flex items-center gap-1">
            {headerIconRight}
            {headerTextRight && (
              <span className={`${colorHeaderTextRight} font-medium`}>
                {headerTextRight}
              </span>
            )}
          </span>
        )}
      </div>

      <div className="mt-2">
        <span className={`text-2xl font-bold ${textColor}`}>{text}</span>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between">
          {linkDetailText && linkDetailPath && (
            <Link
              to={linkDetailPath}
              className="font-medium"
              style={{ color: "gray" }}
            >
              {linkDetailText}
            </Link>
          )}
          {footerIcon && (
            <div className="flex items-center justify-center gap-1 p-4 w-16 h-16 bg-gray-100 rounded-xl">
              <span>{footerIcon}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
