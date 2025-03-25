"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { CustomInput, CustomSelect } from "@/components/CustomInput";
import {
  createUser,
  fetchSetupBanks,
  fetchSetupEntities,
  fetchSetupRoles,
} from "@/app/services/setupService";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";

const Setup = () => {
  const authToken = useSelector((state) => state.auth.token);

  const [banks, setBanks] = useState([]);
  const [roles, setRoles] = useState([]);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isBank, setIsBank] = useState(false);
  const [isBankEntity, setIsBankEntity] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      entity_id: "",
      role_id: "",
      bank_id: "",
    },
  });

  const watchEntityId = watch("entity_id");

  useEffect(() => {
    if (watchEntityId) {
      const selectedEntity = entities.find(
        (entity) => entity.id === watchEntityId
      );
      console.log(selectedEntity);
      const isBank =
        selectedEntity?.name === "Bank" || selectedEntity?.is_bank || false;
      setIsBankEntity(isBank);
      if (!isBank) {
        setValue("bank_id", "", { shouldValidate: true });
      }
    } else {
      setIsBankEntity(false);
    }
  }, [watchEntityId, entities, setValue]);

  const getBanks = async () => {
    try {
      const response = await fetchSetupBanks(authToken);
      if (response?.data && Array.isArray(response.data)) {
        setBanks(response.data);
      } else {
        console.error("Invalid banks data format:", response);
        setBanks([]);
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      setError(error.message || "Failed to fetch banks");
      setBanks([]);
    } finally {
      setLoading(false);
    }
  };

  const getEntities = async () => {
    try {
      setLoading(true);
      const response = await fetchSetupEntities(authToken);
      if (response?.data && Array.isArray(response.data)) {
        setEntities(response.data);
      } else {
        console.error("Invalid enitity data format:", response);
        setEntities([]);
      }
    } catch (error) {
      console.error("Error fetching entities:", error);
      setError(error.message || "Failed to fetch entities");
      setEntities([]);
    } finally {
      setLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      const response = await fetchSetupRoles(authToken);
      if (response?.data && Array.isArray(response.data)) {
        setRoles(response.data);
      } else {
        console.error("Invalid roles data format:", repsonse);
        setRoles([]);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setError(error.message || "Failed to fetch roles");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBanks();
    getEntities();
    getRoles();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log(data);

      const response = await createUser(authToken, data);
      toast.success("User created successfully!");
    } catch (error) {
      toast.error("Error cretaing user");
    } finally {
      setLoading(false);
      reset();
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full  bg-gray-50 p-4 pt-0">
      <h2 className="text-2xl font-bold mb-1">Setup New User</h2>
      <CardDescription className=" mb-2">
        Enter the user details to create a new account
      </CardDescription>
      <Card className="w-[70%] mx- shadow-lg">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                id="first_name"
                label="First Name"
                placeholder="John"
                register={register}
                errors={errors}
                validation={{
                  required: "First name is required",
                  pattern: {
                    value: /^[A-Za-z]+$/i,
                    message: "First name must contain only letters",
                  },
                }}
              />

              <CustomInput
                id="last_name"
                label="Last Name"
                placeholder="Doe"
                register={register}
                errors={errors}
                validation={{
                  required: "Last name is required",
                  pattern: {
                    value: /^[A-Za-z]+$/i,
                    message: "Last name must contain only letters",
                  },
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                id="email"
                label="Email"
                type="email"
                placeholder="john.doe@example.com"
                register={register}
                errors={errors}
                validation={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
              />

              <CustomInput
                id="phone"
                label="Phone Number"
                placeholder="08012345678"
                register={register}
                errors={errors}
                validation={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: "Phone number must be 11 digits",
                  },
                }}
              />
            </div>

            <CustomInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              register={register}
              errors={errors}
              validation={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomSelect
                id="entity_id"
                label="Entity"
                options={entities}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                validation={{
                  required: "Entity is required",
                }}
              />

              <CustomSelect
                id="role_id"
                label="Role"
                options={roles}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                validation={{
                  required: "Role is required",
                }}
              />
            </div>

            {isBankEntity && (
              <CustomSelect
                id="bank_id"
                label="Bank"
                options={banks}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
            )}

            <Button type="submit" className="w-full">
              Create User
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-gray-500">
            By creating this user, you agree to the Terms of Service and Privacy
            Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Setup;
