import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineCalendar,
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineUser,
} from "react-icons/hi";
import { TbReportAnalytics } from "react-icons/tb";
import { RiAiGenerate } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.4rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

function MainNav() {
  const [showCompany, setShowCompany] = useState(false);

  useEffect(() => {
    const storedShowCompany = localStorage.getItem("showCompany");
    if (storedShowCompany) {
      setShowCompany(JSON.parse(storedShowCompany));
    }
  }, [showCompany]);

  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/admin/dashboard">
            <MdDashboard />
            <span>Dashboard</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/admin/department">
            <HiOutlineCalendar />
            <span>Mange Department</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/admin/company">
            <HiOutlineHome />
            <span>Mange Company</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/admin/user">
            <HiOutlineUser />
            <span>Add New Admin</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/admin/criteria">
            <HiOutlineCog />
            <span>Configure Criteria</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/admin/placement">
            <RiAiGenerate />
            <span>Make Algorithm</span>
          </StyledNavLink>
        </li>
        {showCompany && (
          <li>
            <StyledNavLink to="/admin/report">
              <TbReportAnalytics />
              <span>See Report</span>
            </StyledNavLink>
          </li>
        )}
        <li>
          <StyledNavLink to="/admin/account">
            <HiOutlineUser />
            <span>Update Profile</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
