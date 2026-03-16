import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, type InputRef } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ReqCreateRole } from "~/apis/RoleApi/dto/req/ReqCreateRole";
import { roleApi } from "~/apis/RoleApi/RoleApi";
import ActionPermission from "~/components/ActionPermission/ActionPermission";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import StaffPositionList from "~/pages/StaffPosition/components/StaffPositionList/StaffPositionList";
import type { PaginationQuery } from "~/types/PaginationApi";
import type { Role } from "~/types/Role";

export default function StaffPosition() {
  const [open, setOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const { t } = useTranslation();
  const nameInputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsEditMode(false);
    setEditingRole(null);
    form.resetFields();
    setOpen(true);
  };

  const showEditModal = (role: Role) => {
    setIsEditMode(true);
    setEditingRole(role);
    setOpen(true);
  };

  const onFinish = async (values: ReqCreateRole) => {
    setSubmitLoading(true);
    try {
      if (isEditMode && editingRole) {
        // Update existing role
        const res = await roleApi.updateRole(editingRole.id, values);
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === editingRole.id ? { ...role, ...res } : role
          )
        );
        message.success(t("staffPosition.messages.success.update"));
      } else {
        // Create new role
        const res = await roleApi.createRole(values);
        setRoles((prevRoles) => [...prevRoles, res]);
        message.success(t("staffPosition.messages.success.create"));
      }
      form.resetFields();
      setIsEditMode(false);
      setEditingRole(null);
      setOpen(false);
    } catch (error) {
      const errorMessage = isEditMode
        ? t("staffPosition.messages.error.update")
        : t("staffPosition.messages.error.create");
      message.error(errorMessage);
      console.error("Error with role operation:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchRoles = async (
    query: PaginationQuery = { limit: 10, page: 1 }
  ) => {
    setTableLoading(true);
    try {
      const res = await roleApi.getAllRoles(query);
      // setQuery(res.meta);
      setRoles(res.result);
    } catch (error) {
      console.error("Error fetching roles:", error);
      message.error(t("staffPosition.messages.error.fetch"));
    } finally {
      setTableLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      await roleApi.deleteRole(roleId);
      // Update roles state by removing the deleted role
      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
      message.success(t("staffPosition.messages.success.delete"));
    } catch (error) {
      console.error("Error deleting role:", error);
      message.error(t("staffPosition.messages.error.delete"));
    }
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fill form when in edit mode
  useEffect(() => {
    if (open && isEditMode && editingRole) {
      form.setFieldsValue({
        name: editingRole.name,
        desc: editingRole.desc,
      });
    } else if (open && !isEditMode) {
      form.resetFields();
    }
  }, [open, isEditMode, editingRole, form]);

  return (
    <>
      {/* Header */}
      <section className="mb-4">
        <div className="flex items-center justify-end">
          <ActionPermission
            permission={PERMISSIONS_KEY.role.create_role_permission.name}
          >
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                showModal();
              }}
            >
              {t("common.actions.add")}
            </Button>
          </ActionPermission>
        </div>
      </section>

      {/* List */}
      <section>
        <StaffPositionList
          data={roles}
          loading={tableLoading}
          onDelete={handleDeleteRole}
          onEdit={showEditModal}
        />
      </section>

      {/* Modal for Create/Edit Role */}
      <section>
        <Modal
          open={open}
          title={
            isEditMode
              ? t("staffManagement.modal.editPositionTitle")
              : t("staffManagement.modal.addPositionTitle")
          }
          onCancel={() => {
            form.resetFields();
            setIsEditMode(false);
            setEditingRole(null);
            setOpen(false);
          }}
          footer={null}
          destroyOnClose={true}
          afterOpenChange={(open) => {
            if (open && nameInputRef.current) {
              nameInputRef.current.focus();
            }
          }}
        >
          <Form
            form={form}
            name="create-role"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item<ReqCreateRole>
              label={t("staffManagement.fields.name")}
              name="name"
              rules={[
                {
                  required: true,
                  message: t(
                    "staffManagement.messages.validation.nameRequired"
                  ),
                },
              ]}
            >
              <Input
                ref={nameInputRef}
                placeholder={t("staffManagement.placeholders.name")}
              />
            </Form.Item>
            <Form.Item<ReqCreateRole>
              label={t("staffManagement.fields.desc")}
              name="desc"
              rules={[
                {
                  required: true,
                  message: t(
                    "staffManagement.messages.validation.descRequired"
                  ),
                },
              ]}
            >
              <Input placeholder={t("staffManagement.placeholders.desc")} />
            </Form.Item>
            <Form.Item<ReqCreateRole> label={null}>
              <div className="flex justify-end">
                <ActionPermission
                  permission={PERMISSIONS_KEY.role.update_role_permission.name}
                >
                  <Button
                    icon={<PlusCircleOutlined />}
                    type="primary"
                    htmlType="submit"
                    loading={submitLoading}
                  >
                    {isEditMode
                      ? t("common.actions.update")
                      : t("common.actions.submit")}
                  </Button>
                </ActionPermission>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </section>
    </>
  );
}
